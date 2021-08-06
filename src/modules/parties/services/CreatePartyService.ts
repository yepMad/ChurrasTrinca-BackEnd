import { injectable, inject, container } from 'tsyringe';
import { isAfter, parseISO } from 'date-fns';

import AppError from '@shared/errors/AppError';

import CreatePartyUserService from '@modules/parties/services/CreatePartyUserService';
import Party from '@modules/parties/infra/typeorm/entities/Party';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPartiesRepository from '@modules/parties/repositories/IPartiesRepository';

interface Request {
  name: string;
  description: string;
  observation?: string;
  owner_id: string;
  date: string;
}

@injectable()
class CreatePartyService {
  constructor(
    @inject('PartiesRepository') private partiesRepository: IPartiesRepository,

    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute(data: Request): Promise<Party> {
    const { name, date, description, observation, owner_id } = data;

    const user = await this.usersRepository.read({ id: owner_id });
    if (!user) {
      throw new AppError(`Sorry, your user doesn't exist.`, 400);
    }

    const parsedDate = parseISO(date);
    const dateNow = parseISO(new Date().toISOString());

    const isValidDate = isAfter(parsedDate, dateNow);
    if (!isValidDate) {
      throw new AppError('Invalid date.', 400);
    }

    const party = await this.partiesRepository.create({
      name,
      date: parsedDate,
      description,
      observation,
      owner_id,
    });

    const createPartyUser = container.resolve(CreatePartyUserService);
    await createPartyUser.execute({
      party_id: party.id,
      user_id: user.id,
      invite_user_email: user.email,
      general_value: 0,
      drinks_value: 0,
    });

    return party;
  }
}

export default CreatePartyService;
