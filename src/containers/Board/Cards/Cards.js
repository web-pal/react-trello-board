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
    return this.props.connectDropTarget(
      <div className="desk-items">
        {this.props.cards.map((item, i) =>
          <Card moveCard={this.props.moveCard} x={this.props.x} y={i} item={item} key={item.id} />
        )}
      </div>
    );
  }
}


Cards.propTypes = propTypes;

const specs = {
  hover() {
    return {
      text: '123'
    };
  },

  drop() {
    return {
      text: '123'
    };
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
}

export default dropTarget('card', specs, collect)(Cards);
