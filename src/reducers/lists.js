import { Record } from 'immutable';

import { GET_LISTS, GET_LISTS_START } from '../actions/lists';

/* eslint-disable new-cap */
const InitialState = Record({
  isFetching: false,
  lists: []
});
/* eslint-enable new-cap */
const initialState = new InitialState;


export default function lists(state = initialState, action) {
  switch (action.type) {
    case GET_LISTS_START:
      return state.set('isFetching', true);
    case GET_LISTS:
      return state.withMutations((ctx) => {
        ctx.set('isFetching', false)
            .set('lists', action.lists);
      });
    default:
      return state;
  }
}
