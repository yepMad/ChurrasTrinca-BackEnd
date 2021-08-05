import { Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import partiesRouter from '@modules/parties/infra/http/routes/parties.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/parties', partiesRouter);
routes.use('/sessions', sessionsRouter);

export default routes;
