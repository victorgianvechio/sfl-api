import axios from 'axios';
import fs from 'fs';
import path from 'path';

import { CACHE_PATH } from '../../utils/paths';
import { getFarms } from '../../config/sflapi';
import sleep from '../../utils/sleep';
import { FARMS_LIST } from './farms';

class DawnBreakerTicketController {
  async ranking(req, res) {
    try {
      const rawdata = fs.readFileSync(
        path.resolve(CACHE_PATH, `DawnBreakerTicketRanking.json`)
      );
      const result = JSON.parse(rawdata);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ success: false, message: err });
    }
  }

  async generateFile() {
    let rankingResult = [];
    let farmsList = [...FARMS_LIST];

    console.log('farmIdList.length', farmsList.length);
    console.log('FARMS_LIST', FARMS_LIST.length);

    const initTime = Date.now();
    console.log('Processamento iniciado', new Date());

    // Divide o array em grupos com 100 ids
    let farmsRequest = new Array(Math.ceil(farmsList.length / 100))
      .fill()
      .map(() => farmsList.splice(0, 100));

    console.log('farmsRequest.length', farmsRequest.length);
    console.log('FARMS_LIST', FARMS_LIST.length);
  
    console.log('Consultando farms e gerando ranking\n');
  
    let count = 1;
    let erroredIds = []; // Array to store problematic IDs

    // Itera nos grupos de 100 ids
    for (const request of farmsRequest) {
      console.log('request', count);
      try {
        const bodyRequest = {
          ids: request,
        };

        // Busca as farms id (100 por vez)
        const farms = await axios.post(getFarms.url, bodyRequest);
  
        for (const [key, value] of Object.entries(farms.data.farms)) {
          // Monta objeto
          const obj = {
            FarmID: key,
            B_XP: value.bumpkin && value.bumpkin['experience'] ? value.bumpkin['experience'] : 0,
            Land: value.inventory ? value.inventory['Basic Land'] : 0,
            DayR: value.dailyRewards ? value.dailyRewards['streaks'] : 0,
            B_EA: value.bumpkin && value.bumpkin.activity ? value.bumpkin.activity['SFL Earned'] : 0,
            B_SP: value.bumpkin && value.bumpkin.activity ? value.bumpkin.activity['SFL Spent'] : 0,
            B_SU: value.bumpkin && value.bumpkin.activity ? value.bumpkin.activity['Sunflower Harvested'] : 0,            
            B_WO: value.bumpkin && value.bumpkin.activity ? value.bumpkin.activity['Tree Chopped'] : 0,
            B_ST: value.bumpkin && value.bumpkin.activity ? value.bumpkin.activity['Stone Mined'] : 0,
            B_IR: value.bumpkin && value.bumpkin.activity ? value.bumpkin.activity['Iron Mined'] : 0,
            B_GO: value.bumpkin && value.bumpkin.activity ? value.bumpkin.activity['Gold Mined'] : 0,
            B_SH: value.bumpkin && value.bumpkin.activity ? value.bumpkin.activity['Treasure Dug'] : 0,
            B_DR: value.bumpkin && value.bumpkin.activity ? value.bumpkin.activity['Treasure Drilled'] : 0,            
            // ... other properties
          };
          rankingResult.push(obj);
        }
        // Delay after successful batch
        await sleep(getFarms.delay);
      } catch (err) {
        console.log(`ERROR -  ${err}`);
        erroredIds.push(...request); // Add the problematic IDs to the array

        // Delay after encountering an error
        await sleep(getFarms.delay);
      }
      count++;
    }

    const endTime = Date.now() - initTime;
    const endTimeInSeconds = endTime / 1000;
    console.log('Processamento encerrado', new Date());
    console.log('Tempo', `${endTimeInSeconds}s`);
    console.log('---------------------------------------------\n\n');

    // Gera o arquivo JSON
    const updatedAt = new Date();
    fs.writeFileSync(
      path.resolve(CACHE_PATH, 'DawnBreakerTicketRanking.json'),
      JSON.stringify(
        {
          success: true,
          processingTime: `${endTimeInSeconds} seconds`,
          title: 'Dawn Breaker Ticket Ranking',
          updatedAt,
          farms: rankingResult,
          erroredIds: erroredIds, // Add the array of errored IDs to the JSON
        },
        null,
        4
      )
    );
  }
}
export default new DawnBreakerTicketController();
