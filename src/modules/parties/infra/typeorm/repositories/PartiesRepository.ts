import { getRepository, Repository, FindConditions } from 'typeorm';

import IPartiesRepository from '@modules/parties/repositories/IPartiesRepository';
import ICreatePartyDTO from '@modules/parties/dtos/ICreatePartyDTO';

import Party from '../entities/Party';

class PartiesRepository implements IPartiesRepository {
  private ormRepository: Repository<Party>;

  constructor() {
    this.ormRepository = getRepository(Party);
  }

  public async create(data: ICreatePartyDTO): Promise<Party> {
    const party = this.ormRepository.create(data);

    await this.ormRepository.save(party);

    return party;
  }

  public async read(data: FindConditions<Party>): Promise<Party | undefined> {
    const party = await this.ormRepository.findOne(data);

    return party;
  }

  public async update(party: Party): Promise<Party> {
    const response = await this.ormRepository.save(party);

    return response;
  }
}

export default PartiesRepository;
