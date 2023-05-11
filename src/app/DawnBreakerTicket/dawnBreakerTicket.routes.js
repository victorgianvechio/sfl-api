import { Router } from 'express';

import DawnBreakerTicketController from './DawnBreakerTicketController';
// import authMiddleware from '../../middlewares/auth';

const routes = new Router();

// routes.get('/ranking', authMiddleware, DawnBreakerTicketController.ranking);
routes.get('/ranking', DawnBreakerTicketController.ranking);

export default routes;
