import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPartiesRepository from '@modules/parties/repositories/IPartiesRepository';
import IPartiesUsersRepository from '@modules/parties/repositories/IPartiesUsersRepository';

interface Request {
  id: string;
  user_id: string;
}

@injectable()
class DeleteUserPartyService {
  constructor(
    @inject('PartiesRepository')
    private partiesRepository: IPartiesRepository,

    @inject('PartiesUsersRepository')
    private partiesUsersRepository: IPartiesUsersRepository,

    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute(data: Request): Promise<void> {
    const { id, user_id } = data;

    const user = await this.usersRepository.read({
      id: user_id,
    });
    if (!user) {
      throw new AppError(`Sorry, your user doesn't exist.`, 400);
    }

    const partyUserToDel = await this.partiesUsersRepository.read({
      where: { id },
    });
    if (!partyUserToDel) {
      throw new AppError(`This party user doesn't exist.`, 404);
    }

    const party = await this.partiesRepository.read({ id });
    if (!party) {
      throw new AppError(`This party doesn't exist.`, 400);
    }

    const requesterIsPartyOwner = party.owner_id === user_id;
    const requesterTryingToDeleteYourself = partyUserToDel.user_id === user_id;

    if (party.owner_id === partyUserToDel.user_id) {
      throw new AppError(`Não é possível remover o dono do churras.`, 406);
    }

    if (!requesterIsPartyOwner && !requesterTryingToDeleteYourself) {
      throw new AppError(
        `Apenas o dono do churras pode remover outros usuários.`,
        403,
      );
    }

    await this.partiesUsersRepository.delete(id);
  }
}

export default DeleteUserPartyService;
