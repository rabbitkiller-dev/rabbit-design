import {Context} from 'egg';

module.exports = () => {
  return async (ctx: Context, next) => {
    const startTime = Date.now();
    await next();
    // 上报请求时间
    ctx.logger.info(`time: ${Date.now() - startTime} `);
  };
};
