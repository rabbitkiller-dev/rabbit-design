import {EggPlugin} from 'egg';

const plugin: EggPlugin = {
    // static: true,
    // nunjucks: {
    //   enable: true,
    //   package: 'egg-view-nunjucks',
    // },
    validate: {
      enable: true,
      package: 'egg-validate',
    },
    // io: {
    //   enable: true,
    //   package: 'egg-socket.io',
    // },
    ejs: {
      enable: true,
      package: 'egg-view-ejs',
    },
    // session: {
    //   enable: true,
    //   package: 'egg-session',
    // },
    session: true,

  }
;

export default plugin;
