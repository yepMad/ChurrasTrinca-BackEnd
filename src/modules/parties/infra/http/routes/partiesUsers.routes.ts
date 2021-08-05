import { Router } from 'express';

import PartiesUsersController from '@modules/parties/infra/http/controllers/PartiesUsersController';

const partiesUsersRouter = Router();
const partiesUsersController = new PartiesUsersController();

partiesUsersRouter.post('/', partiesUsersController.create);

export default partiesUsersRouter;
