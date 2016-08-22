import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import * as ListsActions from '../../actions/lists';

import CardsContainer from './Cards/CardsContainer';
import CustomDragLayer from './CustomDragLayer';

function mapStateToProps(state) {
  return {
    lists: state.lists.lists,
    isDragging: state.lists.isDragging
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ListsActions, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
@DragDropContext(HTML5Backend)
export default class Board extends Component {
  static propTypes = {
    getLists: PropTypes.func.isRequired,
    moveCard: PropTypes.func.isRequired,
    moveList: PropTypes.func.isRequired,
    toggleDragging: PropTypes.func.isRequired,
    lists: PropTypes.array.isRequired,
    isDragging: PropTypes.bool
  }

  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.moveList = this.moveList.bind(this);
    this.findList = this.findList.bind(this);
    this.scrollRight = this.scrollRight.bind(this);
    this.scrollLeft = this.scrollLeft.bind(this);
    this.stopScrolling = this.stopScrolling.bind(this);
    this.startScrolling = this.startScrolling.bind(this);
    this.state = { isScrolling: false };
  }

  componentWillMount() {
    this.props.getLists(10);
    window.addEventListener('drag', this.startScrolling);
    window.addEventListener('dragend', this.stopScrolling);
  }

  componentWillUnmount() {
    window.removeEventListener('drag', this.startScrolling);
    window.removeEventListener('dragend', this.stopScrolling);
  }

  scrollRight() {
    function scroll() {
      document.getElementsByTagName('main')[0].scrollLeft += 10;
    }
    this.scrollInterval = setInterval(scroll, 10);
  }

  scrollLeft() {
    function scroll() {
      document.getElementsByTagName('main')[0].scrollLeft -= 10;
    }
    this.scrollInterval = setInterval(scroll, 10);
  }

  startScrolling(e) {
    if (e.target.draggable) {
      if (window.innerWidth - e.clientX > 200 && e.clientX > 200) {
        this.stopScrolling();
      } else {
        if (!this.state.isScrolling) {
          if (window.innerWidth - e.clientX < 200) {
            this.setState({ isScrolling: true }, this.scrollRight);
          } else if (e.clientX < 200) {
            this.setState({ isScrolling: true }, this.scrollLeft);
          }
        }
      }
    }
  }

  stopScrolling() {
    clearInterval(this.scrollInterval);
    this.setState({ isScrolling: false });
  }

  moveCard(lastX, lastY, nextX, nextY) {
    this.props.moveCard(lastX, lastY, nextX, nextY);
  }

  moveList(listId, nextX) {
    const { lastX } = this.findList(listId);
    this.props.moveList(lastX, nextX);
  }

  findList(id) {
    const { lists } = this.props;
    const list = lists.filter(l => l.id === id)[0];

    return {
      list,
      lastX: lists.indexOf(list)
    };
  }

  render() {
    const { lists, toggleDragging } = this.props;

    return (
      <div style={{ height: '100%' }}>
        <CustomDragLayer snapToGrid={false} />
        {lists.map((item, i) =>
          <CardsContainer
            key={item.id}
            id={item.id}
            item={item}
            moveCard={this.moveCard}
            moveList={this.moveList}
            findList={this.findList}
            toggleDragging={toggleDragging}
            x={i}
          />
        )}
      </div>
    );
  }
}
