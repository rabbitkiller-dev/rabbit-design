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
  // session: {
  //   enable: true,
  //   package: 'egg-session',
  // },
  session: true
};

export default plugin;
