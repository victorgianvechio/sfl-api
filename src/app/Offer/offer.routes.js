import { Router } from 'express';

import OfferController from './OfferController';
import { BASE_URL, boosters, decoratives } from './collectibles';

import authMiddleware from '../../middlewares/auth';

const routes = new Router();

// routes.get('/', OfferController.all);
routes.get('/', (req, res) => {
  res.status(200).json({ BASE_URL, boosters, decoratives });
});

export default routes;
