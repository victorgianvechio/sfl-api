import { Router } from 'express';

import SolarFlareTicketController from './SolarFlareTicketController';
import authMiddleware from '../../middlewares/auth';

const routes = new Router();

routes.get('/ranking', SolarFlareTicketController.ranking);

export default routes;
