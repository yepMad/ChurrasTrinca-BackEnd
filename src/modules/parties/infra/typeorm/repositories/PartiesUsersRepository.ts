import {
  getRepository,
  Repository,
  FindConditions,
  FindManyOptions,
} from 'typeorm';

import IPartiesUsersRepository from '@modules/parties/repositories/IPartiesUsersRepository';
import ICreatePartyUserDTO from '@modules/parties/dtos/ICreatePartyUserDTO';

import PartyUser from '../entities/PartyUser';

class PartiesRepository implements IPartiesUsersRepository {
  private ormRepository: Repository<PartyUser>;

  constructor() {
    this.ormRepository = getRepository(PartyUser);
  }

  public async create(data: ICreatePartyUserDTO): Promise<PartyUser> {
    const party = this.ormRepository.create(data);

    await this.ormRepository.save(party);

    return party;
  }

  public async read(
    data: FindConditions<PartyUser>,
  ): Promise<PartyUser | undefined> {
    const party = await this.ormRepository.findOne(data);

    return party;
  }

  public async readMany(
    data: FindManyOptions<PartyUser>,
  ): Promise<PartyUser[] | undefined> {
    const party = await this.ormRepository.find(data);

    return party;
  }

  public async update(party: PartyUser): Promise<PartyUser> {
    const response = await this.ormRepository.save(party);

    return response;
  }
}

export default PartiesRepository;
