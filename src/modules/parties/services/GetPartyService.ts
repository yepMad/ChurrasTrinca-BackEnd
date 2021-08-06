import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPartiesRepository from '@modules/parties/repositories/IPartiesRepository';
import IPartiesUsersRepository from '@modules/parties/repositories/IPartiesUsersRepository';

import PartyUser from '@modules/parties/infra/typeorm/entities/PartyUser';

interface Request {
  party_id: string;
  user_id: string;
}

interface PartyInfo {
  id: string;
  title: string;
  date_timestamp: number;
  description: string;
  observation?: string;
  count_users: number;
  total_value: number;
  owner_id: string;
}

interface PartyUserInfos
  extends Omit<
    PartyUser,
    | 'created_at'
    | 'updated_at'
    | 'password'
    | 'user'
    | 'password'
    | 'party'
    | 'party_id'
  > {
  name: string;
}

interface Response {
  party_infos: PartyInfo;
  party_users: PartyUserInfos[];
  is_owner: boolean;
}

@injectable()
class GetPartyService {
  constructor(
    @inject('PartiesRepository') private partiesRepository: IPartiesRepository,

    @inject('PartiesUsersRepository')
    private partiesUsersRepository: IPartiesUsersRepository,

    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute(data: Request): Promise<Response> {
    const { party_id, user_id } = data;

    const user = await this.usersRepository.read({ id: user_id });
    if (!user) {
      throw new AppError(`Sorry, your user doesn't exist.`, 400);
    }

    const party = await this.partiesRepository.read({ id: party_id });
    if (!party) {
      throw new AppError(`This party doesn't exist.`, 404);
    }

    const partyUsers = await this.partiesUsersRepository.readMany({
      where: {
        party_id,
      },
      order: {
        created_at: 'ASC',
      },
      relations: ['user'],
    });

    if (!partyUsers || !partyUsers.some(i => i.user_id === user_id)) {
      throw new AppError(`You don't have permission to access this party`, 403);
    }

    let total_value = 0;
    const party_users = partyUsers.map(i => {
      total_value += i.general_value + i.drinks_value;

      return {
        id: i.id,
        user_id: i.user_id,
        name: i.user.name,
        general_value: i.general_value,
        drinks_value: i.drinks_value,
        itsPaid: i.itsPaid,
      };
    });

    return {
      party_infos: {
        id: party.id,
        description: party.description,
        observation: party.observation,
        title: party.name,
        count_users: partyUsers.length,
        date_timestamp: party.date.getTime(),
        total_value,
        owner_id: party.owner_id,
      },
      party_users,
      is_owner: party.owner_id === user_id,
    };
  }
}

export default GetPartyService;
