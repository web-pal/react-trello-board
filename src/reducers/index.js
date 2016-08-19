import { combineReducers } from 'redux';
import {
  routerReducer
} from 'react-router-redux';

import lists from './lists';
import scrolls from './scrolls';


const rootReducer = combineReducers({
  routing: routerReducer,
  lists,
  scrolls
});

export default rootReducer;
