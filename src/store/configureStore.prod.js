import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';

import rootReducer from '../reducers';

const reduxRouterMiddleware = routerMiddleware(browserHistory);
const middleware = [
  reduxRouterMiddleware,
  thunk,
  promiseMiddleware(),
].filter(Boolean);


function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, compose(
    applyMiddleware(...middleware),
  ));

  return store;
}

export default configureStore;
