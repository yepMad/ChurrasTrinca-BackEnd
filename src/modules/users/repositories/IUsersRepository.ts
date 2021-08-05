import { FindConditions } from 'typeorm';

import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';

export default interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;
  read(data: FindConditions<User>): Promise<User | undefined>;
  update(data: User): Promise<User>;
}
