import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import PartyUser from '@modules/parties/infra/typeorm/entities/PartyUser';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPartiesRepository from '@modules/parties/repositories/IPartiesRepository';
import IPartiesUsersRepository from '@modules/parties/repositories/IPartiesUsersRepository';

interface Request {
  user_id: string;
  party_id: string;
  invite_user_email: string;
  general_value: number;
  drinks_value: number;
}

@injectable()
class CreatePartyUserService {
  constructor(
    @inject('PartiesRepository') private partiesRepository: IPartiesRepository,

    @inject('PartiesUsersRepository')
    private partiesUsersRepository: IPartiesUsersRepository,

    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute(data: Request): Promise<PartyUser> {
    const {
      user_id,
      invite_user_email,
      party_id,
      general_value,
      drinks_value,
    } = data;

    const user = await this.usersRepository.read({
      id: user_id,
    });
    if (!user) {
      throw new AppError(`Sorry, your user doesn't exist.`, 400);
    }

    const party = await this.partiesRepository.read({ id: party_id });
    if (!party) {
      throw new AppError(`This party doesn't exist.`, 400);
    }

    if (party.owner_id !== user.id) {
      throw new AppError(`Only the party owner can invite peoples.`, 401);
    }

    const invitedUser = await this.usersRepository.read({
      email: invite_user_email,
    });
    if (!invitedUser) {
      throw new AppError(`The user you tried to invite doesn't exist.`, 400);
    }

    const hasAddedPartyUser = await this.partiesUsersRepository.read({
      where: { user_id: invitedUser.id, party_id },
    });
    if (hasAddedPartyUser) {
      throw new AppError(`This user is already added.`, 400);
    }

    const partyUser = await this.partiesUsersRepository.create({
      user_id: invitedUser.id,
      party_id,
      general_value,
      drinks_value,
      itsPaid: false,
    });

    return partyUser;
  }
}

export default CreatePartyUserService;
