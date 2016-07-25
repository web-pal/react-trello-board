import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource as dragSource } from 'react-dnd';
import { DropTarget as dropTarget } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import flow from 'lodash/flow';
import Card from './Card';


const propTypes = {
  item: PropTypes.object,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  moveCard: PropTypes.func.isRequired
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
    const { isDragging, connectDragSource, item, connectDropTarget } = this.props;
    return connectDragSource(connectDropTarget(
      <div>
        <Card style={getStyles(isDragging)} item={item} />
      </div>
    ));
  }
}

CardComponent.propTypes = propTypes;

const cardSource = {
  beginDrag(props, monitor, component) {
    const { item, x, y } = props;
    const { id, title, left, top } = item;
    const { clientWidth, clientHeight } = findDOMNode(component);
    // try use getBoundingClientRect
    return { id, title, left, top, item, x, y, clientWidth, clientHeight };
  },
  endDrag(props, monitor, component) {
    // TODO save item to board after end druging
  },
  isDragging(props, monitor) {
    return props.item.id === monitor.getItem().id;
  }
};

const cardTarget = {
  hover(props, monitor, component) {
    const draggedId = monitor.getItem().id;

    const dragIndexX = monitor.getItem().x;
    const dragIndexY = monitor.getItem().y;

    const hoverIndexX = props.x;
    const hoverIndexY = props.y;

    if (dragIndexX === hoverIndexX && dragIndexY === hoverIndexY) {
      return;
    }

    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    if (dragIndexX < hoverIndexX && hoverClientY < hoverMiddleY) {
      return;
    }
    if (dragIndexX > hoverIndexX && hoverClientY > hoverMiddleY) {
      return;
    }

    props.moveCard(dragIndexX, dragIndexY, hoverIndexX, hoverIndexY);

    if (draggedId !== props.id) {
      // TODO make flux move actions
      // console.log('should be moved');
      // props.moveCard(draggedId, props.id);
    }
  }
};

function collectDragSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

export default flow(
  dropTarget('card', cardTarget, connect => ({
    connectDropTarget: connect.dropTarget()
  })),
  dragSource('card', cardSource, collectDragSource)
)(CardComponent);
