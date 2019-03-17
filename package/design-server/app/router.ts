import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  router.get('/api/auth', controller.auth.auth); // 认证信息
  router.post('/api/auth/login', controller.auth.login); // 登录
  router.post('/api/auth/register', controller.auth.register); // 注册

  /**
   * tools-page
   */

  router.get('/api/tools-page', controller.toolsPage.index); // 注册
  router.post('/api/tools-page', controller.toolsPage.add); // 注册
};
