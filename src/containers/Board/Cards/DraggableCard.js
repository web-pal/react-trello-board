import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as scrollActions from '../../../actions/scrolls';
import Card from './Card';


function getStyles(isDragging) {
  return {
    display: isDragging ? 0.5 : 1
  };
}

const cardSource = {
  beginDrag(props, monitor, component) {
    // dispatch to redux store that drag is started
    props.endDrag(true);
    const { item, x, y } = props;
    const { id, title } = item;
    const { clientWidth, clientHeight } = findDOMNode(component);

    // try use getBoundingClientRect
    return { id, title, item, x, y, clientWidth, clientHeight };
  },
  endDrag(props, monitor) {
    // dispatch to redux store that drag is finished
    props.endDrag();

    // on drag end we show the card again
    document.getElementById(monitor.getItem().id).style.display = 'block';
  },
  isDragging(props, monitor) {
    const isDragging = props.item && props.item.id === monitor.getItem().id;
    return isDragging;
  }
};

// const cardTarget = {
//   drop(props, monitor, component) {
//     // TODO save item to board after end dragging
//     const draggedId = monitor.getItem().id;
//     const dragIndexX = monitor.getItem().x;
//     const dragIndexY = monitor.getItem().y;
//     const hoverIndexX = props.x;
//     const hoverIndexY = props.y;
//     if (dragIndexX === hoverIndexX && dragIndexY === hoverIndexY) {
//       return;
//     }
//     // props.moveCard(dragIndexX, dragIndexY, hoverIndexX, hoverIndexY);
//   },
//   hover(props, monitor, component) {
//     // const draggedId = monitor.getItem().id;

//     // const dragIndexX = monitor.getItem().x;
//     // const dragIndexY = monitor.getItem().y;

//     // const hoverIndexX = props.x;
//     // const hoverIndexY = props.y;

//     // if (dragIndexX === hoverIndexX && dragIndexY === hoverIndexY) {
//     //   return;
//     // }


//     // const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
//     // const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
//     // const clientOffset = monitor.getClientOffset();
//     // const hoverClientY = clientOffset.y - hoverBoundingRect.top;

//     // if (dragIndexX < hoverIndexX && hoverClientY < hoverMiddleY) {
//     //   return;
//     // }
//     // if (dragIndexX > hoverIndexX && hoverClientY > hoverMiddleY) {
//     //   return;
//     // }
//     // if (draggedId !== props.id) {
//     //   // TODO make flux move actions
//     //   props.moveCard(dragIndexX, dragIndexY, hoverIndexX, hoverIndexY);
//     // }
//   }
// };

// options: 4rd param to DragSource https://gaearon.github.io/react-dnd/docs-drag-source.html
const OPTIONS = {
  arePropsEqual: function arePropsEqual(props, otherProps) {
    let isEqual = true;
    if (props.item.id === otherProps.item.id &&
        props.x === otherProps.x &&
        props.y === otherProps.y
       ) {
      isEqual = true;
    } else {
      isEqual = false;
    }
    return isEqual;
  }
};


function collectDragSource(connectDragSource, monitor) {
  return {
    connectDragSource: connectDragSource.dragSource(),
    connectDragPreview: connectDragSource.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(scrollActions, dispatch);
}

@connect(null, mapDispatchToProps)
@DragSource('card', cardSource, collectDragSource, OPTIONS)
export default class CardComponent extends Component {
  static propTypes = {
    item: PropTypes.object,
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    endDrag: PropTypes.func,
    x: PropTypes.number.isRequired,
    y: PropTypes.number
  }

  componentDidMount() {
    this.props.connectDragPreview(getEmptyImage(), {
      captureDraggingState: true
    });
  }

  render() {
    const { isDragging, connectDragSource, item } = this.props;

    return connectDragSource(
      <div>
        <Card style={getStyles(isDragging)} item={item} />
      </div>
    );
  }
}
