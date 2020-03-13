import React, {Component} from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Name,
  Bio,
  Avatar,
  Header,
  Starred,
  Stars,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    user: {},
    stars: [],
  };

  async handleData() {
    const {navigation, route} = this.props;

    const user = await route.params.user;

    this.setState({user});

    await navigation.setOptions({title: user.name});
  }

  async componentDidMount() {
    await this.handleData();

    console.tron.log(this.state.user.login);

    const response = await api.get(`/users/${this.state.user.login}/starred`);

    this.setState({stars: response.data});
  }

  render() {
    const {stars, user} = this.state;

    return (
      <Container>
        <Header>
          <Avatar source={{uri: user.avatar}} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        <Stars
          data={stars}
          keyExtractor={star => String(star.id)}
          renderItem={({item}) => (
            <Starred>
              <OwnerAvatar source={{uri: item.owner.avatar_url}} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
        />
      </Container>
    );
  }
}
