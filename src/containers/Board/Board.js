import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DragDropContext, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import * as ListsActions from '../../actions/lists';

import CardsContainer from './Cards/CardsContainer';
import CustomDragLayer from './CustomDragLayer';

function mapStateToProps(state) {
  return {
    lists: state.lists.lists
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ListsActions, dispatch);
}

const listTarget = {
  drop() {}
};

@connect(mapStateToProps, mapDispatchToProps)
@DragDropContext(HTML5Backend)
@DropTarget('column', listTarget, connectDropTarget => ({
  connectDropTarget: connectDropTarget.dropTarget()
}))
export default class Board extends Component {
  static propTypes = {
    getLists: PropTypes.func.isRequired,
    moveCard: PropTypes.func.isRequired,
    moveList: PropTypes.func.isRequired,
    lists: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.moveList = this.moveList.bind(this);
    this.findList = this.findList.bind(this);
  }

  componentWillMount() {
    this.props.getLists(8);
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
    return (
      <div style={{ height: '100%' }}>
        <CustomDragLayer snapToGrid={false} />
        {this.props.lists.map((item, i) =>
          <CardsContainer
            key={item.id}
            id={item.id}
            item={item}
            moveCard={this.moveCard}
            moveList={this.moveList}
            findList={this.findList}
            x={i}
          />
        )}
      </div>
    );
  }
}
