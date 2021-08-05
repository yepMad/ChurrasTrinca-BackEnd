import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

interface Request {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute(request: Request): Promise<Omit<User, 'password'>> {
    const { name, email, password } = request;

    const checkUserExists = await this.usersRepository.read({ email });
    if (checkUserExists) {
      throw new AppError('E-mail address already used.');
    }

    const hashedPassword = await this.hashProvider.generate(password);
    const user = (await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    })) as PartialBy<User, 'password'>;

    delete user.password;

    return user;
  }
}

export default CreateUserService;
