import { injectable, inject } from 'tsyringe';
import { isAfter, parseISO } from 'date-fns';

import AppError from '@shared/errors/AppError';

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

    const isUserExist = await this.usersRepository.read({ id: owner_id });
    if (!isUserExist) {
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

    return party;
  }
}

export default CreatePartyService;
