import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecepientController';
import SessionController from './app/controllers/SessionController';
import DeliveryManController from './app/controllers/DeliveryManController';
import FileController from './app/controllers/FileController';
import OrderController from './app/controllers/OrderController';
import DeliveryStartController from './app/controllers/DeliveryStartController';
import DeliveryEndController from './app/controllers/DeliveryEndController';

import authMiddleware from './app/middlewares/auth';

const upload = multer(multerConfig);
const routes = new Router();

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

routes.get('/deliveryman/:id/deliveries', DeliveryStartController.index);
routes.get('/deliveryman/:id/delivereds', DeliveryEndController.index);

routes.put('/orders/:id/checkin', DeliveryStartController.update);
routes.put('/orders/:id/checkout', DeliveryEndController.update);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.post('/delivery-men', DeliveryManController.store);
routes.get('/delivery-men', DeliveryManController.index);
routes.put('/delivery-men/:id', DeliveryManController.update);
routes.delete('/delivery-men/:id', DeliveryManController.destroy);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

export default routes;
