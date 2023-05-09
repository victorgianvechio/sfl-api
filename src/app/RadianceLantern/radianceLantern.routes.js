import { Router } from 'express';

import RadianceLanternController from './RadianceLanternController';

const routes = new Router();

routes.get('/ranking', RadianceLanternController.ranking);

export default routes;
