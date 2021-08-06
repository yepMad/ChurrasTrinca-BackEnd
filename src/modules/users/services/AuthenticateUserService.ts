import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';

import IUsersRepository from '../repositories/IUsersRepository';

import {HashProvider} from '../providers/';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: Omit<User, 'password'>;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {
  }

  public async execute({ email, password }: Request): Promise<Response> {
    const rawUser = await this.usersRepository.read({ email });
    if (!rawUser) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const matched = await HashProvider.compare(password, rawUser.password);
    if (!matched) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: rawUser.id,
      expiresIn,
    });

    const user = rawUser as PartialBy<User, 'password'>;
    delete user.password;

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
