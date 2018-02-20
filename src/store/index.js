import { createStore, applyMiddleware } from 'redux';
import { persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import reducers from '../reducers';

const config = {
  key: 'root',
  storage,
  whitelist: [
    'app',
    'auth',
  ],
};

const reducer = persistCombineReducers(config, reducers);

const store = createStore(
  reducer,
  {},
  composeWithDevTools(
    applyMiddleware(thunk),
  )
);

export default store;
