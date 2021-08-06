import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPartiesRepository from '@modules/parties/repositories/IPartiesRepository';
import IPartiesUsersRepository from '@modules/parties/repositories/IPartiesUsersRepository';

interface Request {
  user_id: string;
}

interface PartyInfo {
  id: string;
  title: string;
  date_timestamp: number;
  count_users: number;
  total_value: number;
}

type Response = PartyInfo[];

@injectable()
class GetUserPartiesService {
  constructor(
    @inject('PartiesRepository') private partiesRepository: IPartiesRepository,

    @inject('PartiesUsersRepository')
    private partiesUsersRepository: IPartiesUsersRepository,

    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute(data: Request): Promise<Response> {
    const { user_id } = data;

    const isUserExist = await this.usersRepository.read({ id: user_id });
    if (!isUserExist) {
      throw new AppError(`Sorry, your user doesn't exist.`, 400);
    }

    const userParties = await this.partiesUsersRepository.readMany({
      where: {
        user_id,
      },
    });

    if (!userParties) {
      return [];
    }

    const partiesIds = userParties.map(i => i.party_id);
    const parties = await this.partiesRepository.readMany(partiesIds);
    if (!parties) {
      return [];
    }

    const promises = parties.map(async item => {
      const partyUsers = await this.partiesUsersRepository.readMany({
        where: {
          party_id: item.id,
        },
      });

      const usersTotalValues =
        partyUsers?.map(i => i.general_value + i.drinks_value) || [];

      const count_users = partyUsers ? partyUsers.length : 0;
      const total_value = usersTotalValues.reduce((a, b) => a + b, 0);

      return {
        id: item.id,
        title: item.name,
        count_users,
        date_timestamp: item.date.getTime(),
        total_value,
      } as PartyInfo;
    });

    const partiesInfos = await Promise.all(promises);
    return partiesInfos;
  }
}

export default GetUserPartiesService;
