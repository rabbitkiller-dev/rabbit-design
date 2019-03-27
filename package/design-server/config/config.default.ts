import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1543571399715_6877';

  // add your egg config in here
  config.middleware = ['transaction'];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };
  config.session = {
    key: 'RA_DESIGN_SESS',
    maxAge: 24 * 3600 * 1000, // 1 天
    httpOnly: true,
    encrypt: true,
  };
  config.io = {
    init: { }, // passed to engine.io
    namespace: {
      '/': {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
      '/example': {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
    },
  };
  config.view = {
    mapping: {
      '.ejs': 'ejs',
    },
  };
  config.user = {
    userID: '1',
    projectID: '6774c7ae-09a5-48dd-a4aa-8ba0496aed74',
  }
  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
