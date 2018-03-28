/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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
import { NativeRouter, Route, Link } from 'react-router-native';
import Io from 'socket.io-client';
import MostImportant from './MostImportant';
import NoImportant from './NoImportant';

const WEBVIEW_REF = "WEBVIEW_REF";
type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
<NativeRouter>
    <View style={styles.container}>
      <View style={[styles.nav, {height: 150, width: 350, justifyContent: 'center', alignItems: 'center'}]}>
        <Link
          to="/"
          underlayColor='#f0f4f7'>
            <Text style={{fontSize: 40}}>Home</Text>
        </Link>
        <Link
          to="/about"
          underlayColor='#f0f4f7'>
            <Text style={{fontSize: 40}}>About</Text>
        </Link>
      </View>

      <Route exact path="/" component={MostImportant}/>
      <Route path="/about" component={NoImportant}/>
    </View>
  </NativeRouter>
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
