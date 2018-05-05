import React from 'react'
import { Provider } from 'react-redux'
import { options } from './defaults'
import { models } from './model'
import { store, createStore, replaceReducer } from './store'

let started = false;
let Root;

export default function render(component, callback) {
  const { initialState, middlewares, reducers, enhancers } = options;

  if (started) {
    replaceReducer(store, models, reducers);
    if (arguments.length === 0) {
      return Root;
    }
  } else {
    createStore(callback, models, reducers, initialState, middlewares, enhancers);
  }

  Root = function Root() {
    return (
      <Provider store={store}>
        {(typeof component) === "function" ? component() : component}
      </Provider>
    )
  };
  started = true;
  return Root;
};