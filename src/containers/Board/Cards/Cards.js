import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
// import { findDOMNode } from 'react-dom';

import Card from './DraggableCard';


const propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  moveCard: PropTypes.func.isRequired,
  cards: PropTypes.array.isRequired, // list of cards
  x: PropTypes.number.isRequired, // column number
  isOver: PropTypes.bool, // is over current column?
  item: PropTypes.object, // item that is being dragged
  canDrop: PropTypes.bool // defines whether card is being dragged
};


class Cards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholderIndex: undefined
    }; // defined at specs object
  }

  // getPlaceholderIndex(y) {
  //   // this function should be rewritten, if height of the card will be dynamic
  //   let placeholderIndex;

  //   // t0d0: change cardHeight from const
  //   const cardHeight = 161; // height of a single card(excluding marginBottom/paddingBottom)
  //   const cardMargin = 10; // height of a marginBottom+paddingBottom

  //   // t0d0: change offsetHeight from const
  //   const offsetHeight = 84; // height offset from the top of the page

  //   const yPos = y - offsetHeight; // we start counting from the top of dragTarget
  //   if (yPos < cardHeight / 2) {
  //     placeholderIndex = -1; // place at the start
  //   } else {
  //     placeholderIndex = Math.floor((yPos - cardHeight / 2) / (cardHeight + cardMargin));
  //   }

  //   return placeholderIndex;
  // }

  render() {
    const { connectDropTarget, x, cards, isOver, canDrop } = this.props;
    const { placeholderIndex } = this.state;

    let toPlaceFirst;
    let toPlaceLast;
    let cardList = [];
    cards.forEach((item, i) => {
      toPlaceFirst = false;
      if (isOver && canDrop && i === 0 && placeholderIndex === -1) {
        toPlaceFirst = true;
        cardList.push(<div key="placeholder" className="item placeholder" />);
      }
      if (item !== undefined) {
        cardList.push(
          <Card x={x} y={i}
            item={item}
            key={item.id}
          />
        );
      }

      if (isOver && canDrop) {
        toPlaceLast = false;
        // if is over current column and being dragged
        // we check if PLACEHOLDER_INDEX is greater than lenght of the array with cards
        // if it is greater, then we change "toPlaceLast" to true and..
        // ..render placeholder as the last element in the column
        // otherwise render it before element with PLACEHOLDER_INDEX
        if (!toPlaceFirst && placeholderIndex > i) {
          toPlaceLast = true;
        } else if (!toPlaceFirst && !toPlaceLast && placeholderIndex === i) {
          cardList.push(<div key="placeholder" className="item placeholder" />);
        }
      }
    });

    // if placeholder index is greater than array.lenght, display placeholder as last
    if (toPlaceLast) {
      cardList.push(<div key="placeholder" className="item placeholder" />);
    }

    // if there is no items in cards currently, display a placeholder anyway
    if (isOver && canDrop && cards.length === 0) {
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
    canDrop: monitor.canDrop(),
    item: monitor.getItem()
  };
}

function getPlaceholderIndex(y) {
  let placeholderIndex;

  // t0d0: change cardHeight from const
  const cardHeight = 161; // height of a single card(excluding marginBottom/paddingBottom)
  const cardMargin = 10; // height of a marginBottom+paddingBottom

  // t0d0: change offsetHeight from const
  const offsetHeight = 84; // height offset from the top of the page

  // we start counting from the top of dragTarget
  const yPos = y - offsetHeight;

  if (yPos < cardHeight / 2) {
    placeholderIndex = -1; // place at the start
  } else {
    placeholderIndex = Math.floor((yPos - cardHeight / 2) / (cardHeight + cardMargin));
  }

  return placeholderIndex;
}

const specs = {
  drop(props, monitor, component) {
    const { placeholderIndex } = component.state;
    const item = monitor.getItem();
    const lastX = monitor.getItem().x;
    const lastY = monitor.getItem().y;
    const nextX = props.x;
    // const nextY = placeholderIndex === -1 ? 0 : placeholderIndex;
    const nextY = placeholderIndex + 1;

    document.getElementById(item.id).style.display = 'block';

    if (lastX === nextX && lastY === nextY) {
      return;
    }
    console.log(placeholderIndex);

    props.moveCard(lastX, lastY, nextX, nextY);
  },
  hover(props, monitor, component) {
    const placeholderIndex = getPlaceholderIndex(monitor.getClientOffset().y);

    // IMPORTANT!
    // HACK! Since there is an open bug in react-dnd, making it impossible
    // to get the current client offset through the collect function as the
    // user moves the mouse, we do this awful hack and set the state (!!)
    // on the component from here outside the component.
    // https://github.com/gaearon/react-dnd/issues/179
    component.setState({
      placeholderIndex
    });
    const item = monitor.getItem();
    document.getElementById(item.id).style.display = 'none';

    // const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    // console.log(hoverBoundingRect);
    // const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    // const clientOffset = monitor.getClientOffset();
    // const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // if (lastX < hoverIndexX && hoverClientY < hoverMiddleY) {
    //   return;
    // }
    // if (lastX > hoverIndexX && hoverClientY > hoverMiddleY) {
    //   return;
    // }
    // if (draggedId !== props.id) {
    //   props.moveCard(lastX, lastY, hoverIndexX, hoverIndexY);
    // }
  }
};

export default DropTarget('card', specs, collect)(Cards);
