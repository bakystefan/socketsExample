import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  WebView,
  TouchableOpacity,
  BackHandler,
  Dimensions
} from 'react-native';
import uuidv1 from 'uuid/v1';
import { GiftedChat } from 'react-native-gifted-chat'
import Io from 'socket.io-client';

export default class NoImportant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: [],
      userId: 'baki'
    }
    this.socket = Io('http://192.168.0.101:4040');
    this.socket.on('connect', (socket) => {
      this.socket.emit('join', 
        {
          roomIdRedis: `MESSAGE_FOR_5aba57631b03771eaad06f63`,
          userId: this.state.userId,
          roomId: '5aba57631b03771eaad06f63'
        }
      );
    })
    this.socket.on('message', (data) => {
      if (data.userId === this.state.userId) {
        const messageConvert = {
          createdAt: new Date(parseInt(data.date)),
          text: data.text,
          user: {
            _id: userIdForMessage,
          },
          _id: data.messId
        }
        this.setState(previusState => ({
          messages: GiftedChat.append(previusState.messages, messageConvert)
        }))
      }
    })
  }
  componentWillMount() {
    this.socket.emit(`get-messages`, 
      {
        userId: this.state.userId,
        roomIdRedis: `MESSAGE_FOR_5aba57631b03771eaad06f63`,
        roomId: `5aba57631b03771eaad06f63`,
      },
      (data) => {
        const messages = data.map((item) => {
           let userIdForMessage = "";
           const { userId = "", date = "", text = ""} = item;
           if (userId === this.state.userId) {
             userIdForMessage = 1;
           } else {
             userIdForMessage = 2;
           }
           return {
             createdAt: new Date(parseInt(item.date)),
             user: { _id: userIdForMessage },
             text,
             _id: uuidv1(),
           }
        })
        this.setState(previusState => ({
          messages: GiftedChat.append(previusState.messages, messages.reverse()),
        }))
      }
    )
  }

  onSend(messages = []) {
    const { userId } = this.state;
    let [message] = messages;
    console.log('ja sam meesss', messages);
    this.socket.emit(`send-message`, 
      {
        userId,
        roomIdRedis: `MESSAGE_FOR_5aba57631b03771eaad06f63`,
        roomId: `5aba57631b03771eaad06f63`,
        text: message.text,
        messId: message._id
      }
    )
    this.setState(previusState => ({
      messages: GiftedChat.append(previusState.messages, messages),
    }))
  }
  render() {
    console.log('LET ', this.state.messages);
    return (
      <View
        style={styles.container}
      >
      <GiftedChat
      messages={this.state.messages}
      onSend={messages => this.onSend(messages)}
      user={{
        _id: 1,
      }}
    />
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
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
