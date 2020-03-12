import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {Keyboard, ToastAndroid, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';

import {
  Container,
  Input,
  Form,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
} from './styles';

export default class App extends Component {
  state = {
    newUser: '',
    users: [],
    loading: false,
  };

  async componentDidMount() {
    const users = await AsyncStorage.getItem('users');

    if (users) {
      this.setState({users: JSON.parse(users)});
    }
  }

  async componentDidUpdate(_, prevState) {
    const {users} = this.state;

    if (prevState.users !== users) {
      AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }

  handleAddUser = async () => {
    this.setState({loading: true});
    try {
      const {users, newUser} = this.state;

      if (newUser === '-1') throw this.setState({users: []});

      if (newUser === '')
        throw ToastAndroid.show(
          'Digite um usuário válido!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );

      // if (newUser === users[1])
      //   throw ToastAndroid.show(
      //     `Ops! O usuário ${newUser} já existe!`,
      //     ToastAndroid.LONG,
      //     ToastAndroid.CENTER,
      //   );

      const response = await api.get(`/users/${newUser}`);

      const data = {
        name: response.data.name,
        login: response.data.login,
        bio: response.data.bio,
        avatar: response.data.avatar_url,
      };

      this.setState({users: [...users, data]});
    } catch {
      const {newUser} = this.state;

      if (newUser === '-1') {
        ToastAndroid.show(
          `Lista limpa com sucesso!`,
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
      } else {
        ToastAndroid.show(
          `Ops! não foi possivel encontrar o usuário ${newUser}!`,
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
      }
    } finally {
      this.setState({loading: false, newUser: ''});

      Keyboard.dismiss();
    }
  };

  render() {
    const {users, newUser, loading} = this.state;

    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Adicionar Usuário"
            value={newUser}
            onChangeText={text => this.setState({newUser: text})}
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
          />
          <SubmitButton loading={loading} onPress={this.handleAddUser}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Icon name="add" size={20} color="#fff" />
            )}
          </SubmitButton>
        </Form>

        <List
          data={users}
          keyExtractor={user => user.login}
          renderItem={({item}) => (
            <User>
              <Avatar source={{uri: item.avatar}} />
              <Name> {item.name} </Name>
              <Bio>{item.bio}</Bio>

              <ProfileButton onPress={() => {}}>
                <ProfileButtonText>Ver Perfil</ProfileButtonText>
              </ProfileButton>
            </User>
          )}
        />
      </Container>
    );
  }
}
