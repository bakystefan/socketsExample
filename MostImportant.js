import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  WebView,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import Io from 'socket.io-client';

const WEBVIEW_REF = "WEBVIEW_REF";
type Props = {};
export default class MostImportant extends Component<Props> {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={{flex: 1}}> 
        <Text> BLACKOOOOOSLAV</Text>
        <TouchableOpacity>
          <View
            style={{ height: 40, width: 200, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text
              style={{ fontSize: 30 }}
            >
              AJDE
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
