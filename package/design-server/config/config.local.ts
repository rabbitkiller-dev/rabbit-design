import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  config.typeorm = {
    type: 'mysql',
    host: '47.105.84.128',
    port: 3306,
    username: 'rabbit',
    password: 'rabbit',
    database: 'rabbit_dev',
    synchronize: true,
    logging: false,
    // enableAnsiNullDefault: true,
    entities: [
      'app/entity/**/*.ts',
    ],
    migrations: [
      'app/migration/**/*.ts',
    ],
    subscribers: [
      'app/subscriber/**/*.ts',
    ],
    cli: {
      entitiesDir: 'app/entity',
      migrationsDir: 'app/migration',
      subscribersDir: 'app/subscriber',
    },
  };
  return config;
};
