import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreatePartyUserService from '@modules/parties/services/CreatePartyUserService';
import UpdatePartyUserService from '@modules/parties/services/UpdatePartyUserService';
import DeleteUserPartyService from '@modules/parties/services/DeleteUserPartyService';

export default class PartiesUsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { party_id, invite_user_email, general_value, drinks_value } =
      request.body;

    const { user } = request;

    const createPartyUser = container.resolve(CreatePartyUserService);
    const partyUser = await createPartyUser.execute({
      party_id,
      user_id: user.id,
      invite_user_email,
      general_value,
      drinks_value,
    });

    return response.status(200).json(partyUser);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { user, body, params } = request;

    const { itsPaid, general_value, drinks_value } = body;
    const { id } = params;

    const updatePartyUser = container.resolve(UpdatePartyUserService);
    const partyUser = await updatePartyUser.execute({
      id,
      user_id: user.id,
      itsPaid,
      general_value,
      drinks_value,
    });

    return response.status(200).json(partyUser);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { user, params } = request;
    const { id } = params;

    const deleteUserParty = container.resolve(DeleteUserPartyService);
    const partyUser = await deleteUserParty.execute({
      id,
      user_id: user.id,
    });

    return response.status(200).json(partyUser);
  }
}
