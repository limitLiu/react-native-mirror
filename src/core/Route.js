import React from 'react';
import get from 'lodash/get';

export default class Route extends React.PureComponent {
  static defaultProps = {
    Stack: null,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      routeName: props.init,
    };
  }

  getRouteName() {
    return this.state.routeName;
  }

  render() {
    const { Stack } = this.props;
    return (
      <Stack onNavigationStateChange={(prevState, currentState) => {
        const routeName = get(currentState.routes, `${currentState.index}.routeName`);
        this.setState({
          routeName,
        });
      }}/>
    );
  }
}