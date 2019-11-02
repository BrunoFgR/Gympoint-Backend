import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentsController from './app/controllers/StudentsController';
import PlansController from './app/controllers/PlansController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/students', StudentsController.store);
routes.put('/students', StudentsController.update);

routes.post('/plans', PlansController.store);
routes.get('/plans', PlansController.index);
routes.put('/plans/:id', PlansController.update);
routes.delete('/plans/:id', PlansController.delete);

export default routes;
