import { container } from 'tsyringe';

import '@modules/users/providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IPartiesRepository from '@modules/parties/repositories/IPartiesRepository';
import PartiesRepository from '@modules/parties/infra/typeorm/repositories/PartiesRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IPartiesRepository>(
  'PartiesRepository',
  PartiesRepository,
);
