import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext as dragContext } from 'react-dnd';

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
    this.props.getLists(15);
  }

  moveCard(dragIndexX, dragIndexY, hoverIndexX, hoverIndexY) {
    this.props.moveCard(dragIndexX, dragIndexY, hoverIndexX, hoverIndexY);
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        <CustomDragLayer snapToGrid={false} />
        {this.props.lists.map((item, i) =>
          <div x={i} className="desk" key={item.id}>
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
  dragContext(HTML5Backend)(Board)
);

