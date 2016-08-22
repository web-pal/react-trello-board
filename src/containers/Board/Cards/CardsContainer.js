import React, { Component, PropTypes } from 'react';
import { DropTarget, DragSource } from 'react-dnd';

import Cards from './Cards';

const listSource = {
  beginDrag(props) {
    return {
      id: props.id,
      x: props.x
    };
  }
};

const listTarget = {
  canDrop() {
    return false;
  },
  hover(props, monitor, component) {
    const { id: listId } = monitor.getItem();
    const { id: nextX } = props;
    const { isScrollingRight, isScrollingLeft } = component.state;

    if (monitor.getClientOffset().x > window.innerWidth - 160) {
      if (!isScrollingRight) {
        component.setState({ isScrollingRight: true });
        const scrollingSpeed = 5;

        setTimeout(function scrollRight() {
          document.getElementsByTagName('main')[0].scrollLeft += scrollingSpeed;
          if (component.state.isScrollingRight) {
            setTimeout(scrollRight, 10);
          }
        }, 10);
      }
    } else {
      component.setState({ isScrollingRight: false });
    }

    if (monitor.getClientOffset().x < 160) {
      if (!isScrollingLeft) {
        component.setState({ isScrollingLeft: true });
        const scrollingSpeed = 5;

        setTimeout(function scrollLeft() {
          document.getElementsByTagName('main')[0].scrollLeft -= scrollingSpeed;
          if (component.state.isScrollingLeft) {
            setTimeout(scrollLeft, 10);
          }
        }, 10);
      }
    } else {
      component.setState({ isScrollingLeft: false });
    }

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
    findList: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      isScrollingRight: false,
      isScrollingLeft: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isDragEnded) {
      this.setState({
        isScrollingRight: false,
        isScrollingLeft: false
      });
    }
  }


  render() {
    const { connectDropTarget, connectDragSource, item, x, moveCard, isDragging } = this.props;
    const opacity = isDragging ? 0.5 : 1;

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
