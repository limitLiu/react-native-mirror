import React from 'react';
import App from './App';
import { render } from 'mirrorx';
import StackRoute from './core/StackRoute';
import Pages from './pages';
import { persist } from './core/persist';
import { main } from './config';
import { Platform } from 'react-native';
import { composeWithDevTools } from "remote-redux-devtools";

if (__DEV__) {
  (function () {
    global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = composeWithDevTools({
      name: Platform.OS,
      hostname: 'localhost',
      port: 5678,
      realtime: true,
    });
  })();
}


export default render(() => (<App Stack={StackRoute(main, Pages)}/>),
  (createStore, reducer, initialState, enhancer) =>
    (persist(createStore, reducer, initialState, enhancer)));