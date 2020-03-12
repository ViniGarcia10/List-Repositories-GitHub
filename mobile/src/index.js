import React, {Component} from 'react';
import {Text, View} from 'react-native';

import './config/ReactotronConfig';

console.tron.warn('hello world!');

export default class App extends Component {
  render() {
    return (
      <View>
        <Text> React Native </Text>
      </View>
    );
  }
}
