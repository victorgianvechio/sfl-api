import { Router } from 'express';

import DawnBreakerTicketController from './DawnBreakerTicketController';

const routes = new Router();

// routes.get('/ranking', authMiddleware, DawnBreakerTicketController.ranking);
routes.get('/ranking', DawnBreakerTicketController.ranking);

export default routes;
