import React, { Component, PropTypes } from 'react';
import { DropTarget, DragSource } from 'react-dnd';
// import { findDOMNode } from 'react-dom';

import Cards from './Cards';

const listSource = {
  beginDrag(props) {
    return {
      id: props.item.id,
      lastIndex: props.findList(props.item.id).index
    };
  },
  endDrag(props, monitor) {
    console.log('drag ended');
    console.log(monitor.getItem());
    // TODO
    const { id: droppedId, lastIndex } = monitor.getItem();
    const didDrop = monitor.didDrop();

    if (!didDrop) {
      props.moveList(droppedId, lastIndex);
    }
    // TODO

    // make column visible again
    // document.getElementsByClassName('desk-container')[
    //   monitor.getItem().id].style.display = 'inline-block';

    // delete placeholder
  }
};

const listTarget = {
  canDrop() {
    return false;
  },
  hover(props, monitor) {
    const { id: draggedId } = monitor.getItem();
    const { id: overId } = props.item;

    if (draggedId !== overId) {
      const { index: overIndex } = props.findList(overId);
      props.moveList(draggedId, overIndex);
    }

    // dispatch to store index, where placeholder should be displayed

    // horizontal scroll listener
    // TODO

    // hide column during the drag
    // document.getElementsByClassName('desk-container')[
    //   monitor.getItem().id].style.display = 'none';
  }
};

@DropTarget('list', listTarget, connectDragSource => ({
  connectDropTarget: connectDragSource.dropTarget(),
}))
@DragSource('list', listSource, (connectDragSource, monitor) => ({
  connectDragSource: connectDragSource.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class CardsDropTarget extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    item: PropTypes.object,
    x: PropTypes.number,
    moveCard: PropTypes.func.isRequired,
    moveList: PropTypes.func.isRequired,
    isDragging: PropTypes.bool,
    findList: PropTypes.func
  }

  render() {
    const {
      connectDropTarget, connectDragSource, item, x, moveCard, isDragging
    } = this.props;
    const opacity = isDragging ? 0 : 1;

    return connectDragSource(connectDropTarget(
      <div className="desk" style={{ opacity }}>
        <div className="desk-head">
          <div className="desk-name">{item.name}</div>
        </div>
        <Cards moveCard={moveCard} x={x} cards={item.cards} />
      </div>
    ));
  }
}
