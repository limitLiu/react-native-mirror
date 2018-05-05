import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { actions } from "mirrorx";
import { connect } from "react-redux";

@connect(state => ({ counter: state.app.get('counter') }))
export default class Test extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={async () => {
          // this.setState((state) => ({ test: state.test + 1 }));
          await actions.test.addClick();
        }}>
          <Text>test view</Text>
          <Text>{`${this.props.counter}`}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.props.onBack}>
          <Text>onBack</Text>
        </TouchableOpacity>
      </View>
    );
  }
}