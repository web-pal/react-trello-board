import React, { Component, PropTypes } from 'react';
import { DropTarget as dropTarget } from 'react-dnd';

import Card from './DraggableCard';


const propTypes = {
  cards: PropTypes.array.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  x: PropTypes.number.isRequired,
  moveCard: PropTypes.func.isRequired,
  isOverCurrent: PropTypes.bool,
  isOver: PropTypes.bool,
  currentOffset: PropTypes.object,
  item: PropTypes.object,
  canDrop: PropTypes.bool
};


class Cards extends Component {
  constructor(props) {
    super(props);
    // look at specs object
    this.state = {
      currentOffset: undefined,
      dragItem: undefined
    };
  }

  getPlaceholderIndex(yPos, cardHeight, offsetHeight) {
    // TODO change offsetHeight from const
    // TODO change cardHeight from const

    // yPos - Y coordinate of cursor
    return Math.floor((yPos - offsetHeight) / cardHeight);
  }

  render() {
    const { isOver, moveCard, x, cards, connectDropTarget, canDrop } = this.props;
    const { currentOffset, dragItem } = this.state;

    const cardHeight = 171; // height of a single card(including marginBottom/paddingBottom)
    const offsetHeight = 88; // height offset from the top of the page

    // if (dragItem) {
    //   const dragItemId = dragItem.id;
    //   if (canDrop) {
    //     document.getElementById(dragItemId).style.display = 'block';
    //   } else {
    //     document.getElementById(dragItemId).style.display = 'none';
    //   }
    // }

    let toPlaceLast;
    let cardList = [];
    cards.forEach((item, i) => {
      if (isOver && currentOffset) {
        toPlaceLast = false;
        // if is over current column and being dragged
        // we check if placeholder index greater than lenght of the array with cards
        // if it is greater, then we changer "toPlaceLast" to true and render placeholder
        // as the last element in the column
        // otherwise render it before element with placeholder_index
        if (this.getPlaceholderIndex(currentOffset.y, cardHeight, offsetHeight) > i) {
          toPlaceLast = true;
        } else if (!toPlaceLast &&
          this.getPlaceholderIndex(currentOffset.y, cardHeight, offsetHeight) === i
        ) {
          cardList.push(<div key="placeholder" className="item placeholder" />);
        }
      }

      // don't display element which is being dragged
      // TODO
      // TODO
      // TODO
      // const toHide = canDrop && (dragItem && dragItem.id === item.id);
      // TODO
      // TODO
      // TODO

      // check if item is available and if it should be displayed
      if (item !== undefined) {
        cardList.push(
          <Card moveCard={moveCard}
            x={x}
            y={i} item={item}
            key={item.id}
          />
        );
      }
    });

    // if there is no items in cards currently, display a placeholder anyway
    if (isOver && currentOffset && cards.length === 0) {
      cardList.push(<div key="placeholder" className="item placeholder" />);
    }

    // if placeholder index is greater than array.lenght, display placeholder as last
    if (toPlaceLast) {
      cardList.push(<div key="placeholder" className="item placeholder" />);
    }

    return connectDropTarget(
      <div className="desk-items">
        {cardList}
      </div>
    );
  }
}


Cards.propTypes = propTypes;

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    currentOffset: monitor.getSourceClientOffset(),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
    item: monitor.getItem()
  };
}

const specs = {
  drop(props, monitor) {
    // TODO save item to board after end druging
    // const draggedId = monitor.getItem().id;
    const item = monitor.getItem();
    const dragIndexX = monitor.getItem().x;
    const dragIndexY = monitor.getItem().y;
    const hoverIndexX = props.x;
    const hoverIndexY = props.y;
    if (dragIndexX === hoverIndexX && dragIndexY === hoverIndexY) {
      return;
    }
    document.getElementById(item.id).style.display = 'block';
    props.moveCard(dragIndexX, dragIndexY, hoverIndexX, hoverIndexY);
  },
  hover(props, monitor, component) {
    // IMPORTANT!
    // HACK! Since there is an open bug in react-dnd, making it impossible
    // to get the current client offset through the collect function as the
    // user moves the mouse, we do this awful hack and set the state (!!)
    // on the component from here outside the component.
    // https://github.com/gaearon/react-dnd/issues/179
    component.setState({
      currentOffset: monitor.getSourceClientOffset(),
      dragItem: monitor.getItem()
    });
    const item = monitor.getItem();
    document.getElementById(item.id).style.display = 'none';
    // const draggedId = monitor.getItem().id;

    // const dragIndexX = monitor.getItem().x;
    // const dragIndexY = monitor.getItem().y;

    // const hoverIndexX = props.x;
    // const hoverIndexY = props.y;

    // if (dragIndexX === hoverIndexX && dragIndexY === hoverIndexY) {
    //   return;
    // }


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
    //   props.moveCard(dragIndexX, dragIndexY, hoverIndexX, hoverIndexY);
    // }
  }
  // canDrop(props, monitor) {
  //   return true;
  // }
};

export default dropTarget('card', specs, collect)(Cards);
