import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';

import Card from './DraggableCard';


function getPlaceholderIndex(y, scrollY) {
  let placeholderIndex;

  // t0d0: change cardHeight from const
  const cardHeight = 161; // height of a single card(excluding marginBottom/paddingBottom)
  const cardMargin = 10; // height of a marginBottom+paddingBottom

  // t0d0: change offsetHeight from const
  const offsetHeight = 84; // height offset from the top of the page

  // we start counting from the top of dragTarget
  const yPos = y - offsetHeight + scrollY;

  if (yPos < cardHeight / 2) {
    placeholderIndex = -1; // place at the start
  } else {
    placeholderIndex = Math.floor((yPos - cardHeight / 2) / (cardHeight + cardMargin));
  }

  return placeholderIndex;
}

const specs = {
  drop(props, monitor, component) {
    document.getElementById(monitor.getItem().id).style.display = 'block';
    const { placeholderIndex } = component.state;
    const lastX = monitor.getItem().x;
    const lastY = monitor.getItem().y;
    const nextX = props.x;
    let nextY = (lastX === nextX) ? placeholderIndex : placeholderIndex + 1;

    // if dragging to top
    if (lastX === nextX && lastY - nextY > 1) {
      nextY = nextY + 1;
      if (lastY - nextY === 1) {
        props.moveCard(lastX, lastY, nextX, nextY);
        return;
      }
    }

    if ((lastX === nextX && lastY === nextY) ||
    (lastX === nextX && nextY + 1 === lastY) || nextY === -1) {
      return;
    }

    props.moveCard(lastX, lastY, nextX, nextY);
  },
  hover(props, monitor, component) {
    // defines where placeholder is rendered
    const placeholderIndex = getPlaceholderIndex(
      monitor.getClientOffset().y,
      findDOMNode(component).scrollTop
    );
    // console.log(placeholderIndex);

    // horizontal scroll
    if (!props.isScrolling) {
      if (window.innerWidth - monitor.getClientOffset().x < 200) {
        props.startScrolling('toRight');
      } else if (monitor.getClientOffset().x < 200) {
        props.startScrolling('toLeft');
      }
    } else {
      if (window.innerWidth - monitor.getClientOffset().x > 200 &&
          monitor.getClientOffset().x > 200
      ) {
        props.stopScrolling();
      }
    }

    // IMPORTANT!
    // HACK! Since there is an open bug in react-dnd, making it impossible
    // to get the current client offset through the collect function as the
    // user moves the mouse, we do this awful hack and set the state (!!)
    // on the component from here outside the component.
    // https://github.com/gaearon/react-dnd/issues/179
    component.setState({ placeholderIndex });

    // when drag begins, we hide the card and only display cardDragPreview
    const item = monitor.getItem();
    document.getElementById(item.id).style.display = 'none';
  }
};


@DropTarget('card', specs, (connectDragSource, monitor) => ({
  connectDropTarget: connectDragSource.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
  item: monitor.getItem()
}))
export default class Cards extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    moveCard: PropTypes.func.isRequired,
    cards: PropTypes.array.isRequired,
    x: PropTypes.number.isRequired,
    isOver: PropTypes.bool,
    item: PropTypes.object,
    canDrop: PropTypes.bool,
    startScrolling: PropTypes.func,
    stopScrolling: PropTypes.func,
    isScrolling: PropTypes.bool
  }

  constructor(props) {
    super(props);
    this.state = {
      placeholderIndex: undefined,
      isScrolling: false,
    };
  }

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
            stopScrolling={this.props.stopScrolling}
          />
        );
      }

      if (isOver && canDrop) {
        toPlaceLast = false;
        if (!toPlaceFirst && placeholderIndex > i) {
          toPlaceLast = true;
        } else if (!toPlaceFirst && !toPlaceLast && placeholderIndex === i) {
          cardList.push(<div key="placeholder" className="item placeholder" />);
        }
      }
    });

    // if placeholder index is greater than array.length, display placeholder as last
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
