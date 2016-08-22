import React, { Component, PropTypes } from 'react';
import { DropTarget, DragSource } from 'react-dnd';

import Cards from './Cards';

const listSource = {
  beginDrag(props) {
    props.toggleDragging(true);
    return {
      id: props.id,
      x: props.x
    };
  },
  endDrag(props) {
    props.toggleDragging(false);
  }
};

const listTarget = {
  canDrop() {
    return false;
  },
  hover(props, monitor) {
    const { id: listId } = monitor.getItem();
    const { id: nextX } = props;
    if (listId !== nextX) {
      props.moveList(listId, props.x);
    }
  }
};

@DropTarget('list', listTarget, connectDragSource => ({
  connectDropTarget: connectDragSource.dropTarget(),
}))
@DragSource('list', listSource, (connectDragSource, monitor) => ({
  connectDragSource: connectDragSource.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class CardsContainer extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    item: PropTypes.object,
    x: PropTypes.number,
    moveCard: PropTypes.func.isRequired,
    moveList: PropTypes.func.isRequired,
    isDragging: PropTypes.bool,
    findList: PropTypes.func,
    toggleDragging: PropTypes.func
  }

  render() {
    const { connectDropTarget, connectDragSource, item, x,
      moveCard, isDragging, toggleDragging } = this.props;
    const opacity = isDragging ? 0.5 : 1;

    return connectDragSource(connectDropTarget(
      <div className="desk" style={{ opacity }}>
        <div className="desk-head">
          <div className="desk-name">{item.name}</div>
        </div>
        <Cards toggleDragging={toggleDragging} moveCard={moveCard} x={x} cards={item.cards} />
      </div>
    ));
  }
}
