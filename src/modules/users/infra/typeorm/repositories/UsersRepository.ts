import { getRepository, Repository, FindConditions } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(data);

    await this.ormRepository.save(user);

    return user;
  }

  public async read(data: FindConditions<User>): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(data);

    return user;
  }

  public async update(user: User): Promise<User> {
    const response = await this.ormRepository.save(user);

    return response;
  }
}

export default UsersRepository;
