import React, { Component, PropTypes } from 'react';
// import { findDOMNode } from 'react-dom';
import { DragSource } from 'react-dnd';

import Cards from './Cards';

const specs = {
  beginDrag(props) {
    const { id, name } = props.item;
    return { id, name };
  },
  endDrag(props, monitor) {
    // make column visible again
    document.getElementsByClassName('desk-container')[
      monitor.getItem().id].style.display = 'inline-block';

    // delete placeholder
    props.setListPlaceholder(-1);
  },
  isDragging(props, monitor) {
    const isDragging = props.item && props.item.id === monitor.getItem().id;
    return isDragging;
  }
};


function getStyles(isDragging) {
  return {
    display: isDragging ? 0.5 : 1
  };
}

@DragSource('column', specs, (connectDragSource, monitor) => ({
  connectDragSource: connectDragSource.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class CardsDragSource extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    x: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    setListPlaceholder: PropTypes.func.isRequired,
    moveCard: PropTypes.func.isRequired
  }

  render() {
    const { isDragging, moveCard, x, connectDragSource, item } = this.props;

    return connectDragSource(
      <div className="desk" style={getStyles(isDragging)}>
        <div className="desk-head">
          <div className="desk-name">{item.name}</div>
        </div>
        <Cards moveCard={moveCard} x={x} cards={item.cards} />
      </div>
    );
  }
}

