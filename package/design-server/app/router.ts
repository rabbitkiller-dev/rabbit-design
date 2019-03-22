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
  router.delete('/api/tools-page', controller.toolsPage.delete); // 注册
  router.get('/api/tools-page/page-info/:pageID', controller.toolsPage.findOne); // 注册
  router.put('/api/tools-page/page-info', controller.toolsPage.pageInfoModify); // 注册
  /**
   * tools-data-source
   */
  router.get('/api/data-source', controller.dataSource.index);
  /**
   * tools-icon
   */
  router.get('/api/tools-icon/fetchIconfont', controller.toolsIcon.fetchIconfont); // 获取iconfont字体
};
