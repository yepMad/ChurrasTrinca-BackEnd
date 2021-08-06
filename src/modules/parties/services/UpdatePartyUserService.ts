import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import PartyUser from '@modules/parties/infra/typeorm/entities/PartyUser';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPartiesRepository from '@modules/parties/repositories/IPartiesRepository';
import IPartiesUsersRepository from '@modules/parties/repositories/IPartiesUsersRepository';

interface Request {
  user_id: string;
  id: string;
  general_value?: number;
  drinks_value?: number;
  itsPaid?: boolean;
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

@injectable()
class UpdatePartyUserService {
  constructor(
    @inject('PartiesRepository') private partiesRepository: IPartiesRepository,

    @inject('PartiesUsersRepository')
    private partiesUsersRepository: IPartiesUsersRepository,

    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute(data: Request): Promise<PartyUserInfos> {
    const { id, user_id, itsPaid, general_value, drinks_value } = data;

    const user = await this.usersRepository.read({
      id: user_id,
    });
    if (!user) {
      throw new AppError(`Sorry, your user doesn't exist.`, 400);
    }

    const partyUser = await this.partiesUsersRepository.read({
      where: { id },
      relations: ['user'],
    });
    if (!partyUser) {
      throw new AppError(`This party doesn't exist.`, 400);
    }

    partyUser.itsPaid = itsPaid !== undefined ? itsPaid : partyUser.itsPaid;
    partyUser.general_value =
      general_value !== undefined ? general_value : partyUser.general_value;
    partyUser.drinks_value =
      drinks_value !== undefined ? drinks_value : partyUser.drinks_value;

    const savedPartyUser = await this.partiesUsersRepository.update(partyUser);
    return {
      id: savedPartyUser.id,
      name: partyUser.user.name,
      general_value: savedPartyUser.general_value,
      drinks_value: savedPartyUser.drinks_value,
      itsPaid: savedPartyUser.itsPaid,
      user_id: savedPartyUser.user_id,
    };
  }
}

export default UpdatePartyUserService;
