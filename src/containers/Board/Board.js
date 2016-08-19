import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DragDropContext, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import * as ListsActions from '../../actions/lists';

import CardsDropTarget from './Cards/CardsDropTarget';
import CustomDragLayer from './CustomDragLayer';

function mapStateToProps(state) {
  return {
    lists: state.lists.lists,
    listPlaceholderIndex: state.lists.listPlaceholderIndex
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ListsActions, dispatch);
}

const listTarget = {
  drop() {
  }
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
    lists: PropTypes.array.isRequired,
    listPlaceholderIndex: PropTypes.number
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

  moveList(lastX, nextX) {
    this.props.moveList(lastX, nextX);
  }

  moveCard(lastX, lastY, nextX, nextY) {
    this.props.moveCard(lastX, lastY, nextX, nextY);
  }

  findList(id) {
    const { lists } = this.props;
    // TODO rewrite
    const list = lists.filter(item => item.id === id)[0];

    return {
      list,
      index: lists.indexOf(list)
    };
  }


  render() {
    const { lists, listPlaceholderIndex } = this.props;
    let deskList = [];
    lists.forEach((item, i) => {
      if (listPlaceholderIndex === i) {
        deskList.push(
          <div key="column_placeholder" className="desk-placeholder" />
        );
      }
      deskList.push(
        <CardsDropTarget
          key={item.id}
          item={item}
          moveCard={this.moveCard}
          moveList={this.moveList}
          findList={this.findList}
          x={i}
        />
      );
    });

    return (
      <div style={{ height: '100%' }}>
        <CustomDragLayer snapToGrid={false} />
        {deskList}
      </div>
    );
  }
}
