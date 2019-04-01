#!/usr/bin/env node
const commander = require('commander');
commander.version('0.0.1').description('welcome use rabbit-design');

// commander
//   .option('-r, --router', 'npm run router')
//   .option('-u, --update', 'npm run router');


// commander
//   .command('init [project]')
//   .alias('i')
//   .description('初始化项目')
//   .action(init);
// commander
//   .command('update [mode]')
//   .alias('u')
//   .description('更新本地包')
//   .option('-p, --package <path>', '更新包路径')
//   .option('-s, --server <path>', '服务器地址')
//   .action(update);
// commander
//   .command('download [mode]')
//   .alias('d')
//   .description('下载代码')
//   .option('-p, --package <path>', '更新包路径')
//   .option('-s, --server <path>', '服务器地址')
//   .action(download);

commander
  .command('i18n [env]')
  .description('国际化')
  .option('-w, --watch', '开启监听', false)
  .action(execute('i18n'));

function execute(type): (mode, options) => void {
  const Start = require('./' + type + '.js');
  return function (mode, options) {
    const start = new Start(mode, options);
    start.start().then(() => {
    }, (err) => {
      console.error(err.message);
    });
  };
}

commander.parse(process.argv);

if (process.argv.length === 2) {
  commander.outputHelp();
}

