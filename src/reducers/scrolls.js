import { END_DRAG, LIST_PLACEHOLDER } from '../actions/scrolls';

const initialState = {
  isDragEnded: false,
  listPlaceholder: undefined
};

export default function scrolls(state = initialState, action) {
  switch (action.type) {
    case END_DRAG:
      return Object.assign({}, state, { isDragEnded: !action.isDragStarted });
    case LIST_PLACEHOLDER:
      return Object.assign({}, state, { listPlaceholder: action.placeholderIndex });
    default:
      return state;
  }
}
