import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreatePartyService from '@modules/parties/services/CreatePartyService';
import GetUserPartiesService from '@modules/parties/services/GetUserPartiesService';

export default class PartiesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, date, description, observation } = request.body;

    const createParty = container.resolve(CreatePartyService);
    const party = await createParty.execute({
      name,
      date,
      description,
      observation,
      owner_id: request.user.id,
    });

    return response.status(200).json(party);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const getUserParties = container.resolve(GetUserPartiesService);
    const userParties = await getUserParties.execute({
      user_id: request.user.id,
    });

    return response.status(200).json(userParties);
  }
}
