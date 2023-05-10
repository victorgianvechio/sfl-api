import express from 'express';
import path from 'path';

import { monit } from './cron';
import { publicPath } from './utils/paths';
import allowCors from './middlewares/cors';

// import solarFlareTicketRoutes from './app/SolarFlareTicket/solarFlareTicket.routes';
import dawnBreakerTicketRoutes from './app/DawnBreakerTicket/dawnBreakerTicket.routes';
// import radianceLanternRoutes from './app/RadianceLantern/radianceLantern.routes';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    monit();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(allowCors);
    this.server.use(express.static('./public'));
    this.server.use('/public', express.static('./public'));
  }

  routes() {
    // this.server.get('/home', (req, res) => {
    //   res.sendFile(path.resolve(publicPath, 'index.html'));
    // });

    this.server.get('/', (req, res) => {
      res.redirect('/api/v1');
    });

    this.server.get('/api/v1', (req, res) => {
      return res
        .status(200)
        .json({ status: true, message: 'sfl-api is running' });
    });

    // this.server.use('/api/v1/SolarFlareTicket', solarFlareTicketRoutes);
    this.server.use('/api/v1/DawnBreakerTicket', dawnBreakerTicketRoutes);
    // this.server.use('/api/v1/RadianceLantern', radianceLanternRoutes);
  }
}

export default new App().server;
