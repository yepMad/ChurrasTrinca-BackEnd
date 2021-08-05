import { Router } from 'express';

import PartiesController from '@modules/parties/infra/http/controllers/PartiesController';

import ensureAuthenticated from '@shared/middlewares/ensureAuthenticated';

const partiesRouter = Router();
const partiesController = new PartiesController();

partiesRouter.use(ensureAuthenticated);
partiesRouter.post('/', partiesController.create);

export default partiesRouter;
