import { combineReducers } from 'redux';
import {
  routerReducer
} from 'react-router-redux';

import lists from './lists';


const rootReducer = combineReducers({
  routing: routerReducer,
  lists,
});

export default rootReducer;
