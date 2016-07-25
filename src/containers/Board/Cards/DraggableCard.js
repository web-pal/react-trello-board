import React, { Component, PropTypes } from 'react';
import { DragSource as source } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import Card from './Card';


const propTypes = {
  item: PropTypes.object,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired
};


function getStyles(props) {
  const { isDragging } = props;

  return {
    opacity: isDragging ? 0 : 1
  };
}

class CardComponent extends Component {
  componentDidMount() {
    this.props.connectDragPreview(getEmptyImage(), {
      captureDraggingState: true
    });
  }

  render() {
    return this.props.connectDragSource(
      <div>
        <Card style={getStyles(this.props)} item={this.props.item} />
      </div>
    );
  }
}


CardComponent.propTypes = propTypes;

const cardSource = {
  beginDrag(props) {
    const { id, title, left, top, item } = props;
    return { id, title, left, top, item };
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

export default source('card', cardSource, collect)(CardComponent);
