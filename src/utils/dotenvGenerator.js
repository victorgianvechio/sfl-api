import fs from 'fs';
import path from 'path';

import { ROOT_PATH } from './paths';

function createFile() {
  const stream = fs.createWriteStream(path.resolve(ROOT_PATH, '.env'));

  stream.once('open', () => {
    // Info
    stream.write(`# Info`);
    stream.write('\n');
    stream.write('APP_NAME=SFL API');
    stream.write('\n\n');

    // App
    stream.write(`# App`);
    stream.write('\n');
    stream.write(`DEV_APP_URL=http://127.0.0.1`);
    stream.write('\n');
    stream.write(`PROD_APP_URL=http://168.138.141.170`);
    stream.write('\n');
    stream.write(`APP_PORT=8080`);
    stream.write('\n\n');

    // Auth
    stream.write(`# Auth`);
    stream.write('\n');
    stream.write(
      "APP_SECRET=Gf^3DsP.çZ^2[TXL[e>tX3/Cc)I*W<'ÇG^w}75;?´-f>W/a´66]t`s4dF3IRdWahSr,^9`q1:=jPyL-V@)hSO~8^@<P!,o2^+'mQ<pb5LJk^$PR+v;z')h-_bRt1fl03"
    );

    // Sentry
    stream.write('# Sentry');
    stream.write('\n');
    stream.write(
      'SENTRY_DSN=https://6fb6453dfe654679bfa2800da543f1c7@o4505162165911552.ingest.sentry.io/4505162168991744'
    );

    stream.end();

    console.log('\nSuccessfully created file\n');
  });
}

createFile();
