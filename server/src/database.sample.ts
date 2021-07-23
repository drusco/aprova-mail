import { v1 as uuidv1 } from 'uuid';
import { hashSync } from 'bcryptjs';
import slugify from 'slugify';
import { Record } from './types/record.type';
import { Database } from './types/database.type';
import { User } from './types/user.type';

const cities: Record[] = [
  'São Paulo',
  'Rio de Janeiro',
  'Salvador',
  'Brasília',
  'Fortaleza',
  'Belo Horizonte',
  'Manaus',
  'Curitiba',
  'Recife',
  'Porto Alegre',
].map(
  (city) =>
    <Record>{
      uuid: uuidv1(),
      value: city,
      created: Date.now(),
      updated: null,
    },
);

const date = Date.now();
const users = [
  <Record>{
    uuid: uuidv1(),
    created: date,
    updated: null,
    value: <User>{
      nome: 'John Smith',
      nickname: 'admin',
      senha: hashSync('admin', 10),
      cidade: cities[0].uuid,
    },
  },
];
const fakeNames = [
  'Donna Lambert',
  'Rachel McDonald',
  'Ava Kelly',
  'Emma Ross',
  'Grace Manning',
  'Leonard Manning',
  'Anna Marshall',
  'Tracey Metcalfe',
  'Amanda Carr',
  'Penelope Davies',
];

cities.forEach((city, index) => {
  for (let i = 0; i < fakeNames.length; i++) {
    const nome = fakeNames[i];
    const nickname = slugify(nome, '.').toLowerCase() + index + i;
    users.push(<Record>{
      uuid: uuidv1(),
      created: date,
      updated: null,
      value: <User>{
        nome,
        nickname,
        senha: hashSync(nickname, 10),
        cidade: city.uuid,
      },
    });
  }
});

export default <Database>{
  users,
  cities,
  messages: [],
};
