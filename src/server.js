import './config/dotenv';
import App from './App';
import { createCacheDir } from './utils/paths';

const port = process.env.PORT || 8080;

createCacheDir();

App.listen(port, () => {
  console.log(`sfl-api is running on port ${port} - ${new Date()}`);
});
