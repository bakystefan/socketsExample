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
    this.socket = Io('http://192.168.0.101:4040');
    this.socket.on('connect', (socket) => {
      this.socket.emit('join', `MESSAGE_FOR_5aba57631b03771eaad06f63`);
    })
    this.socket.on('message', (data) => {
      console.log('server odgovorio ', data);
    })
  }

  componentDidMount() {
    this.socket.emit(`MESSAGE_FOR_5aba57631b03771eaad06f63`, {
      name: 'bakilisko',
    })
  }

  render() {
    return (
      <View style={{flex: 1}}> 
        <Text> BLACKOOOOOSLAV </Text>
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
