import Cron from 'node-cron';

import DawnBreakerTicketController from './app/DawnBreakerTicket/DawnBreakerTicketController';

export function monit() {
  // Immediately execute the function when the server starts
  executeFunction();
  
  // Cron to execute every 30 minutes after the immediate execution
  Cron.schedule('*/1 * * *', () => {
    executeFunction();
  });
}

async function executeFunction() {
  // Call the function to generate the file
  await DawnBreakerTicketController.generateFile();
}
