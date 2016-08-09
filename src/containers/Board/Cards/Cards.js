import React, { Component, PropTypes } from 'react';
import { DropTarget as dropTarget } from 'react-dnd';
import { DragSource as dragSource } from 'react-dnd';

import Card from './DraggableCard';


const propTypes = {
  cards: PropTypes.array.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  x: PropTypes.number.isRequired,
  moveCard: PropTypes.func.isRequired
};


class Cards extends Component {
  render() {
    let boardX = undefined;
    if (this.props.isOverCurrent) {
      boardX = this.props.x;
    }
    return this.props.connectDropTarget(
      <div className="desk-items">
        {this.props.cards.map((item, i) => {
          let res;
          if (item === undefined) {
            res = null;
          } else {
            res = (
              <Card moveCard={this.props.moveCard} x={this.props.x} y={i} item={item} key={item.id} />
            );
          }
          return res;
        }
        )}
      </div>
    );
  }
}


Cards.propTypes = propTypes;

// const specs = {
//   hover() {
//     return {
//       text: '123'
//     };
//   },

//   drop() {
//     return {
//       text: '123'
//     };
//   }
// };

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
}

const specs = {
  drop(props, monitor, component) {
    // TODO save item to board after end druging
    const draggedId = monitor.getItem().id;
    const dragIndexX = monitor.getItem().x;
    const dragIndexY = monitor.getItem().y;
    const hoverIndexX = props.x;
    const hoverIndexY = props.y;
    if (dragIndexX === hoverIndexX && dragIndexY === hoverIndexY) {
      return;
    }
    props.moveCard(dragIndexX, dragIndexY, hoverIndexX, hoverIndexY);
  },
  hover(props, monitor, component) {
    // const draggedId = monitor.getItem().id;

    // const dragIndexX = monitor.getItem().x;
    // const dragIndexY = monitor.getItem().y;

    // const hoverIndexX = props.x;
    // const hoverIndexY = props.y;

    // if (dragIndexX === hoverIndexX && dragIndexY === hoverIndexY) {
    //   return;
    // }

    // console.log(monitor.isOver({ shallow: true }));

    // const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    // const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    // const clientOffset = monitor.getClientOffset();
    // const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // if (dragIndexX < hoverIndexX && hoverClientY < hoverMiddleY) {
    //   return;
    // }
    // if (dragIndexX > hoverIndexX && hoverClientY > hoverMiddleY) {
    //   return;
    // }
    // if (draggedId !== props.id) {
    //   // TODO make flux move actions
    //   // console.log('should be moved');
    //   props.moveCard(dragIndexX, dragIndexY, hoverIndexX, hoverIndexY);
    // }
  }
  // canDrop(props, monitor) {
  //   //console.log(monitor.canDrop());
  //   return true;
  // }
};


export default dropTarget('card', specs, collect)(Cards);
