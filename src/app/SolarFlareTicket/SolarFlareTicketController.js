import axios from 'axios';
import puppeteer from 'puppeteer';
import util from 'util';
import fs from 'fs';
import path from 'path';

import { CACHE_PATH } from '../../utils/paths';
import { SolarFlareTicket } from '../../config/dune';
import { getFarms } from '../../config/sflapi';
import sleep from '../../utils/sleep';

class SolarFlareTicketController {
  async ranking(req, res) {
    try {
      const rawdata = fs.readFileSync(
        path.resolve(CACHE_PATH, `SolarFlareTicketRanking.json`)
      );
      const result = JSON.parse(rawdata);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ success: false, message: err });
    }
  }

  async generateFile() {
    const NUMBER_OF_PAGES = SolarFlareTicket.pages;
    const NUMBER_OF_FARMS = SolarFlareTicket.farms;
    const ua =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36';

    let rankingResult = [];

    const initTime = Date.now();
    console.log('Processamento iniciado', new Date());

    console.log('Criando browser');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--single-process'],
    });
    console.log('Browser criado');

    console.log('Criando page');
    const page = await browser.newPage();
    await page.setUserAgent(ua);
    console.log('Page criada');

    console.log('Iniciando link');
    try {
      await page.goto(SolarFlareTicket.url, {
        waitUntil: 'domcontentloaded',
        timeout: 5000,
      });
      await page.waitForSelector('.visual_result__tveha');
      await page.waitForSelector('.table_table__fuS_N');
    } catch (err) {
      console.log(err);
      await browser.close();
    }
    console.log('Link iniciado');

    console.log('Carregando dados');
    await sleep(10000);
    console.log('Dados carregados');

    console.log('Iniciando scrapping');
    const farmIdList = await page.evaluate(
      async (NUMBER_OF_PAGES, NUMBER_OF_FARMS) => {
        let id = '';
        const list = [];

        // Localiza o botão next
        const nextButton = await document.querySelector(
          '#__next > div > main > div:nth-child(1) > div > section > div > div > article:nth-child(3) > div > ul > li:nth-child(6) > button'
        );

        try {
          // Itera entre as páginas
          for (let page = 0; page < NUMBER_OF_PAGES; page++) {
            console.log('page', page);

            // Extrai os IDS
            for (let row = 1; row <= NUMBER_OF_FARMS; row++) {
              id = await document.querySelector(
                '#__next > div > main > div:nth-child(1) > div > section > div > div > article:nth-child(3) > div > div.visual_result__tveha > table > tbody > tr:nth-child(' +
                  row +
                  ') > td:nth-child(2) > div'
              ).innerText;
              list.push(Number(id));
              console.log('row: ' + row + ' - id: ' + id);
            }

            // Dispara o evento do click no botão para avançar para proxima página
            nextButton.click();
          }
        } catch (err) {
          console.log('querySelectorError:', err);
        }
        return list;
      },
      NUMBER_OF_PAGES,
      NUMBER_OF_FARMS
    );

    await browser.close();

    console.log('Scrapping finalizado');
    console.log(`${NUMBER_OF_PAGES} páginas percorridas`);
    console.log(`${NUMBER_OF_PAGES * NUMBER_OF_FARMS} farm id extraído`);
    console.log('farm ids', util.inspect(farmIdList, { maxArrayLength: null }));

    // Divide o array em grupos com 100 ids
    const farmsRequest = new Array(Math.ceil(farmIdList.length / 100))
      .fill()
      .map(() => farmIdList.splice(0, 100));

    console.log('\n\n-----------------------\n\n');

    console.log('Consultando farms e gerando ranking\n');

    let count = 1;

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
            SolarFlareTicket: value.inventory['Solar Flare Ticket'],
            Quest: {
              Description: value.hayseedHank.chore.description,
              Requirement: value.hayseedHank.chore.requirement,
              Activity: value.hayseedHank.chore.activity,
            },
          };
          rankingResult.push(obj);
        }
        count++;
        await sleep(getFarms.delay);
      } catch (err) {
        console.log(`ERROR -  ${err}`);
      }
    }

    // Ordena o array
    rankingResult.sort(
      (a, b) => Number(b.SolarFlareTicket) - Number(a.SolarFlareTicket)
    );

    // Cria propriedade Ranking
    rankingResult = rankingResult.map((element, index) => ({
      Ranking: index + 1,
      ...element,
    }));

    const endTime = Date.now() - initTime;
    const endTimeInSeconds = endTime / 1000;
    console.log('Processamento encerrado', new Date());
    console.log('Tempo', `${endTimeInSeconds}s`);

    // Gera o arquivo JSON
    const updatedAt = new Date();
    fs.writeFileSync(
      path.resolve(CACHE_PATH, 'SolarFlareTicketRanking.json'),
      JSON.stringify(
        {
          success: true,
          processingTime: `${endTimeInSeconds} seconds`,
          title: 'Solar Flare Ticket Ranking',
          updatedAt,
          farms: rankingResult,
        },
        null,
        4
      )
    );
  }
}

export default new SolarFlareTicketController();
