import React, {Component, Profiler} from 'react';
import {Keyboard, ToastAndroid} from 'react-native';
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
  };

  handleAddUser = async () => {
    try {
      const {users, newUser} = this.state;

      if (newUser === '')
        throw ToastAndroid.show(
          'Digite um usuário válido!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );

      const response = await api.get(`/users/${newUser}`);

      const data = {
        name: response.data.name,
        login: response.data.login,
        bio: response.data.bio,
        avatar: response.data.avatar_url,
      };

      this.setState({
        users: [...users, data],
        newUser: '',
      });

      Keyboard.dismiss();
    } catch {
      const {newUser} = this.state;

      ToastAndroid.show(
        `Ops! não foi possivel buscar o usuário ${newUser}!`,
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );

      Keyboard.dismiss();
    } finally {
    }
  };

  render() {
    const {users, newUser} = this.state;

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
          <SubmitButton onPress={this.handleAddUser}>
            <Icon name="add" size={20} color="#fff" />
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
