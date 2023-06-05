import DawnBreakerTicketController from './app/DawnBreakerTicket/DawnBreakerTicketController';
import path from 'path';
import fs from 'fs';
import { CACHE_PATH } from './utils/paths';

function start() {
  DawnBreakerTicketController.generateFile();
}

function ranking() {
  const rawdata = fs.readFileSync(
    path.resolve(CACHE_PATH, `DawnBreakerTicketRanking.json`)
  );
  const result = JSON.parse(rawdata);
  const resultSorted = result.farms.sort(
    (a, b) => Number(b.Mushrooms) - Number(a.Mushrooms)
  );

  const ranking = resultSorted.map((element, index) => ({
    Ranking: index + 1,
    ...element,
  }));

  fs.writeFileSync(
    path.resolve(CACHE_PATH, 'DawnBreakerTicketRanking2.json'),
    JSON.stringify(
      {
        farms: ranking,
      },
      null,
      4
    )
  );
}

start();
