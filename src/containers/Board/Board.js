import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import * as ListsActions from '../../actions/lists';

import Cards from './Cards/Cards';
import CustomDragLayer from './CustomDragLayer';


const propTypes = {
  getLists: PropTypes.func.isRequired,
  moveCard: PropTypes.func.isRequired,
  lists: PropTypes.array.isRequired
};

class Board extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
  }

  componentWillMount() {
    this.props.getLists(8);
  }

  moveCard(dragIndexX, dragIndexY, hoverIndexX, hoverIndexY) {
    this.props.moveCard(dragIndexX, dragIndexY, hoverIndexX, hoverIndexY);
  }

  render() {
    const { lists } = this.props;

    return (
      <div style={{ height: '100%' }}>
        <CustomDragLayer snapToGrid={false} />
        {lists.map((item, i) =>
          <div className="desk" key={item.id}>
            <div className="desk-head">
              <div className="desk-name">{item.name}</div>
            </div>
            <Cards moveCard={this.moveCard} x={i} cards={item.cards} />
          </div>
        )}
      </div>
    );
  }
}

Board.propTypes = propTypes;


function mapStateToProps(state) {
  return {
    lists: state.lists.lists
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ListsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  DragDropContext(HTML5Backend)(Board)
);
