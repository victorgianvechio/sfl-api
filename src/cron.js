import Cron from 'node-cron';

import SolarFlareTicketController from './app/SolarFlareTicket/SolarFlareTicketController';

export function monit() {
  // Cron para executar a cada 10min
  Cron.schedule('*/10 * * * *', async () => {
    // Chamar função para gerar arquivo
    SolarFlareTicketController.generateFile();
  });
}
