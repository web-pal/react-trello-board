import React, { Component, PropTypes } from 'react';
import { DragSource as dragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import Card from './Card';


const propTypes = {
  item: PropTypes.object,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
};


function getStyles(isDragging) {
  return {
    opacity: isDragging ? 0.5 : 1
  };
}

class CardComponent extends Component {
  componentDidMount() {
    this.props.connectDragPreview(getEmptyImage(), {
      captureDraggingState: true
    });
  }

  render() {
    const { isDragging, connectDragSource, item } = this.props;
    return connectDragSource(
      <div>
        <div ref="card-dom-component">
          <Card style={getStyles(isDragging)} item={item} />
        </div>
      </div>
    );
  }
}

CardComponent.propTypes = propTypes;

const cardSource = {
  beginDrag(props, monitor, component) {
    const item = props.item;
    const { id, title, left, top } = item;
    const { clientWidth, clientHeight } = component.refs['card-dom-component'];
    return { id, title, left, top, item, clientWidth, clientHeight };
  },
  endDrag(props, monitor, component) {
    // TODO save item to board after end druging
  },
  isDragging(props, monitor) {
    return props.item.id === monitor.getItem().id;
  }
};

function collectDragSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

export default dragSource('card', cardSource, collectDragSource)(CardComponent);
