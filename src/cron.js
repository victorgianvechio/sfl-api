import Cron from 'node-cron';

// import SolarFlareTicketController from './app/SolarFlareTicket/SolarFlareTicketController';
import DawnBreakerTicketController from './app/DawnBreakerTicket/DawnBreakerTicketController';
// import RadianceLanternController from './app/RadianceLantern/RadianceLanternController';

export function monit() {
  // Cron para executar a cada 10min
  Cron.schedule('*/30 * * * *', async () => {
    // Chamar função para gerar arquivo
    // SolarFlareTicketController.generateFile();
    // await RadianceLanternController.generateFile();
    await DawnBreakerTicketController.generateFile();
  });
}
