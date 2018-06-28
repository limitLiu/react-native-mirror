import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import { actions } from "mirrorx";
import { connect } from "react-redux";
import { Button } from 'react-native-material-ui';

@connect(state => ({ counter: state.app.get('counter'), str: state.app.get('rand_str') }))
export default class Test extends React.Component {

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

        <Text>{this.props.str}</Text>
        <Button
          onPress={async () => {
            await actions.app.addClick()
          }}
          upperCase={false}
          primary
          raised
          text={`${this.props.counter}`}/>


        <Button upperCase={false} onPress={this.props.onBack} text='onBack' raised accent/>
      </View>
    );
  }
}