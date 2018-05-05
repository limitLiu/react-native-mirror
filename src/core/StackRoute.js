import React from 'react';
import { get as _get, forEach as _forEach } from 'lodash';
import { createStackNavigator, NavigationActions } from 'react-navigation';

class Actions {
  _nav = null;

  constructor(nav) {
    this._nav = nav;
  }

  nav = this;

  dispatch = (action) => {
    this._nav.dispatch(action);
  };
  push = (config) => {
    this.dispatch(NavigationActions.navigate({
      routeName: config.name,
      params: config.props,
    }));
  };
  replace = (config) => {
    this.replaceAtIndex(config, 0);
  };
  replaceAtIndex = (config, index) => {
    this.dispatch(NavigationActions.reset({
      index,
      actions: [
        NavigationActions.action({
          routeName: config.name,
          params: config.props,
        })
      ],
    }));
  };
  pop = () => {
    this.dispatch(NavigationActions.back({}));
  };

  onBack = this.pop;

  popToTop = () => {
    const { key } = _get(this._nav.state, 'nav.routes.1', { key: null });
    if (!key) return;
    const backAction = NavigationActions.back({ key });
    this.dispatch(backAction);
  };
}

export function Stack(pages) {
  const stacks = {};

  Object.keys(pages).forEach(name => {
    const Component = pages[name];
    stacks[name] = {
      path: name,
      screen: (props) => {
        let params = _get(props, 'navigation.state.params', {});
        let actions = new Actions(props.navigation);
        if (Component.Dir) {
          return null;
        } else {
          return <Component {...params} {...actions}/>
        }
      },
    }
  });

  return stacks;
}

export default function (initRoute, pages = []) {
  return createStackNavigator(Stack(pages), {
    initialRouteName: initRoute,
    headerMode: 'none',
    cardStyle: {
      backgroundColor: 'white',
    }
  });
}