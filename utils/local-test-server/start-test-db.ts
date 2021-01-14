import { start } from './local-db-util';

start()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
