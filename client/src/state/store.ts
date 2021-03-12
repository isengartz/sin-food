import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import handleApiMiddleware from './middleware/handle-api-middleware';
import reducers from './reducers';

export const store = createStore(
  reducers,
  {},
  //@ts-ignore
  applyMiddleware(handleApiMiddleware, thunk, logger),
);
