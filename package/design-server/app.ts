import {createConnection} from 'typeorm';

import 'reflect-metadata';

export default (app) => {
  app.beforeStart(async () => {
    const typeormConfig = await app.config.typeorm;
    app.typeorm = await createConnection(typeormConfig);
  });
};
