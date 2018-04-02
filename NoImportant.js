import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  WebView,
  BackHandler,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native';
import uuidv1 from 'uuid/v1';
import { GiftedChat } from 'react-native-gifted-chat'
import Io from 'socket.io-client';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob'

export default class NoImportant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: [],
      messager: "",
      userId: 'baki',
      avatarSource: null,
    }
    this.socket = Io('http://192.168.0.103:4040');
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
      if (data.userId !== this.state.userId) {
        const messageConvert = {
          createdAt: new Date(parseInt(data.date)),
          text: data.text,
          user: {
            _id: 2,
          },
          _id: data.messId
        }
        this.setState(previusState => ({
          messages: GiftedChat.append(previusState.messages, messageConvert)
        }))
      }
    })
  }
  
  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        const formData = new FormData();
        console.log('ja sam sel file ', this.state.selectedFile);
        formData.append('file', 'data:image/png;base64,' + response.data, response);
        RNFetchBlob.fetch(
          'POST',
          `http://192.168.0.103:4040/api/images-upload`, 
          {'Content-Type': 'multipart/form-data'},
          [
            {
              name: 'file',
              filename: response.fileName,
              data: RNFetchBlob.wrap(response.uri),
            }
          ]
        )
        .then(result => result.json())
        .then((data) => {
          
          const messageForReal = {
            createdAt: new Date(),
            text: '',
            user: {
              _id: 1,
            },
            _id: uuidv1(),
            image: data.imageUrl
          };

          this.socket.emit(`send-message`, 
            {
              userId: this.state.userId,
              roomIdRedis: `MESSAGE_FOR_5aba57631b03771eaad06f63`,
              roomId: `5aba57631b03771eaad06f63`,
              text: data.imageUrl,
              messId: messageForReal._id,
              image: messageForReal.image
            }
          )
          this.setState(previusState => ({
            messages: GiftedChat.append(previusState.messages, [messageForReal]),
            messager: ''
          }));
        });
      }
    });
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
             image: item.image
           }
        })
        this.setState(previusState => ({
          messages: GiftedChat.append(previusState.messages, messages.reverse()),
        }))
      }
    )
  }

  onSend(messages = []) {
    const { userId, messager } = this.state;
    const messageForReal = {
      createdAt: new Date(),
      text: messager,
      user: {
        _id: 1,
      },
      _id: uuidv1(),
    };
    this.socket.emit(`send-message`, 
      {
        userId,
        roomIdRedis: `MESSAGE_FOR_5aba57631b03771eaad06f63`,
        roomId: `5aba57631b03771eaad06f63`,
        text: messageForReal.text,
        messId: messageForReal._id,
        image: messageForReal.image
      }
    )
    this.setState(previusState => ({
      messages: GiftedChat.append(previusState.messages, [messageForReal]),
      messager: ''
    }));
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
      renderInputToolbar={(yes) => {
        return (
          <View
            style={{
              width: Dimensions.get('window').width,
              flexDirection: 'row'
            }}
          >
          <TouchableOpacity
            onPress={() => this.selectPhotoTapped()}
          >
           <View style={[styles.avatar, styles.avatarContainer, {}]}>
            { this.state.avatarSource === null ? <Text>Select</Text> :
              <Image style={styles.avatar} source={this.state.avatarSource} />
            }
          </View>
          </TouchableOpacity>
          <TextInput
            autoCorrect={false}
            style={{width: 160}}
            value={this.state.messager}
            multiline
            onChangeText={(text) => this.setState({ messager: text })}
            placeholder="Type your message here" 
          />
          <TouchableOpacity
            onPress={() =>this.onSend()}
          >
           <Text>Send</Text>
          </TouchableOpacity>
          </View>
        )
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
