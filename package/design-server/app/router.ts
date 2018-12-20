import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  router.get('/api/auth', controller.auth.auth); // 认证信息
  router.post('/api/auth/login', controller.auth.login); // 登录
  router.post('/api/auth/register', controller.auth.register); // 注册
};
