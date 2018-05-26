import React from 'react';
import { View, Text, TouchableOpacity, AsyncStorage } from 'react-native';
import { actions } from "mirrorx";

export default class Welcome extends React.Component {

  render() {
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity
          style={{ width: 60, height: 40 }}
          onPress={() => {
            this.props.push({ name: 'test', });
            actions.app.initial();
          }}>
          <Text>
            click me
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ width: 60, height: 40 }}
          onPress={() => AsyncStorage.clear()}>
          <Text>clear</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
