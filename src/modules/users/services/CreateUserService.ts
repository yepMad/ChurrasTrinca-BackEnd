import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface Request {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute(request: Request): Promise<Omit<User, 'password'>> {
    const { name, email, password } = request;

    const checkUserExists = await this.usersRepository.read({ email });
    if (checkUserExists) {
      throw new AppError('E-mail address already used.');
    }

    const user = (await this.usersRepository.create({
      name,
      email,
      password,
    })) as PartialBy<User, 'password'>;

    delete user.password;

    return user;
  }
}

export default CreateUserService;
