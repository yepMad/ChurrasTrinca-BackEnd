import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreatePartyService from '@modules/parties/services/CreatePartyService';

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
}
