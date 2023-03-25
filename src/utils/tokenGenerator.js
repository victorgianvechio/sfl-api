import '../config/dotenv';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth';

/*
  Para gerar um token com validade passar o número de dias
  ex:
    yarn token 3d - válido para 3 dias
    yarn token 7d - válido para 7 dias
    yarn token 30d - válido para 30 dias
    yarn token - se não passar parâmetro o token nunca expira
*/

function generateToken() {
  const value = new Date();
  let token = '';

  if (process.argv[2] !== undefined) {
    const expiresIn = String(process.argv[2]);
    token = jwt.sign({ value }, authConfig.secret, {
      expiresIn,
    });
  } else {
    token = jwt.sign({ value }, authConfig.secret, {});
  }

  console.log(`\n${token}\n`);
}

generateToken();
