import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  config.apiPrefix = '/design/';
  config.typeorm = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'rabbit',
    password: 'rabbit',
    database: 'rabbit_dev',
    synchronize: true,
    logging: false,
    // enableAnsiNullDefault: true,
    entities: [
      'app/entity/**/*.js',
    ],
    migrations: [
      'app/migration/**/*.js',
    ],
    subscribers: [
      'app/subscriber/**/*.js',
    ],
    cli: {
      entitiesDir: 'app/entity',
      migrationsDir: 'app/migration',
      subscribersDir: 'app/subscriber',
    },
  };
  return config;
};
