import React from 'react';
import {Text} from 'react-native';

// import { Container } from './styles';

export default function User({route}) {
  const user = route.params.user;

  return <Text>Usuário: {user.name}</Text>;
}
