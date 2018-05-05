import {
  createStore as _createStore,
  applyMiddleware,
  combineReducers,
  compose
} from 'redux'

import createMiddleware from './middleware'

export let store;

export function createStore(callback, models, reducers, initialState, middlewares = [], optionEnhancers = []) {

  const middleware = applyMiddleware(
    ...middlewares,
    createMiddleware()
  );

  const enhancers = [middleware, ...optionEnhancers];

  let composeEnhancers = compose;

  // Following line to exclude from coverage report:
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'production') {
    // Redux devtools extension support.
    if (global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      composeEnhancers = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    }
  }

  const reducer = createReducer(models, reducers);
  const enhancer = composeEnhancers(...enhancers);

  store = callback(_createStore, reducer, initialState, enhancer);
}

export function replaceReducer(store, models, reducers) {
  const reducer = createReducer(models, reducers);
  store.replaceReducer(reducer)
}

function createReducer(models, reducers) {

  const modelReducers = models.reduce((acc, cur) => {
    acc[cur.name] = cur.reducer;
    return acc
  }, {});

  return combineReducers({
    ...reducers,
    ...modelReducers,
  })

}