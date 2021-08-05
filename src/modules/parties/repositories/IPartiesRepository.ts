import { FindConditions } from 'typeorm';

import Party from '@modules/parties/infra/typeorm/entities/Party';
import ICreatePartyDTO from '@modules/parties/dtos/ICreatePartyDTO';

export default interface IPartiesRepository {
  create(data: ICreatePartyDTO): Promise<Party>;
  read(data: FindConditions<Party>): Promise<Party | undefined>;
  update(data: Party): Promise<Party>;
}
