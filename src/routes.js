import { Router } from 'express';

import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecepientController';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

export default routes;
