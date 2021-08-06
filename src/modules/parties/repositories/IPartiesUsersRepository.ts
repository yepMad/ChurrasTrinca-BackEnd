import { FindOneOptions, FindManyOptions } from 'typeorm';

import PartyUser from '@modules/parties/infra/typeorm/entities/PartyUser';
import ICreatePartyUserDTO from '@modules/parties/dtos/ICreatePartyUserDTO';

export default interface IPartiesUsersRepository {
  create(data: ICreatePartyUserDTO): Promise<PartyUser>;
  read(data: FindOneOptions<PartyUser>): Promise<PartyUser | undefined>;
  readMany(data: FindManyOptions<PartyUser>): Promise<PartyUser[] | undefined>;
  update(data: PartyUser): Promise<PartyUser>;
  delete(id: string): Promise<void>;
}
