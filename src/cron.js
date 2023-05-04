import Cron from 'node-cron';

// import SolarFlareTicketController from './app/SolarFlareTicket/SolarFlareTicketController';
import DawnBreakerTicketController from './app/DawnBreakerTicket/DawnBreakerTicketController';

export function monit() {
  // Cron para executar a cada 10min
  Cron.schedule('*/15 * * * *', async () => {
    // Chamar função para gerar arquivo
    // SolarFlareTicketController.generateFile();
    DawnBreakerTicketController.generateFile();
  });
}
