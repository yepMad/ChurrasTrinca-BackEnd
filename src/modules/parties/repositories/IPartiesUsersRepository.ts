import { FindConditions } from 'typeorm';

import PartyUser from '@modules/parties/infra/typeorm/entities/PartyUser';
import ICreatePartyUserDTO from '@modules/parties/dtos/ICreatePartyUserDTO';

export default interface IPartiesUsersRepository {
  create(data: ICreatePartyUserDTO): Promise<PartyUser>;
  read(data: FindConditions<PartyUser>): Promise<PartyUser | undefined>;
  update(data: PartyUser): Promise<PartyUser>;
}
