import { Router } from 'express';

import PartiesController from '@modules/parties/infra/http/controllers/PartiesController';
import PartiesUsers from '@modules/parties/infra/http/routes/partiesUsers.routes';

import ensureAuthenticated from '@shared/middlewares/ensureAuthenticated';

const partiesRouter = Router();
const partiesController = new PartiesController();

partiesRouter.use(ensureAuthenticated);

partiesRouter.post('/', partiesController.create);

partiesRouter.use('/users', PartiesUsers);

export default partiesRouter;
