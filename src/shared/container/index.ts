import { container } from 'tsyringe';

import '@modules/users/providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IPartiesRepository from '@modules/parties/repositories/IPartiesRepository';
import PartiesRepository from '@modules/parties/infra/typeorm/repositories/PartiesRepository';

import IPartiesUsersRepository from '@modules/parties/repositories/IPartiesUsersRepository';
import PartiesUsersRepository from '@modules/parties/infra/typeorm/repositories/PartiesUsersRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IPartiesRepository>(
  'PartiesRepository',
  PartiesRepository,
);

container.registerSingleton<IPartiesUsersRepository>(
  'PartiesUsersRepository',
  PartiesUsersRepository,
);
