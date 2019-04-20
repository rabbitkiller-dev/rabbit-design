import {SideBarPo} from './side-bar.po';

describe('side-bar', () => {
  let page: SideBarPo;

  beforeEach(() => {
    page = new SideBarPo();
  });

  // it('侧边栏-数据源管理', async () => {
  //   await page.wait();
  //   page.clickSideBar('dataSource');
  //   // expect(page.getTitleText()).toEqual('Welcome to design-front!');
  // });
  // it('侧边栏-页面管理', async () => {
  //   await page.wait();
  //   page.clickSideBar('page');
  //   // expect(page.getTitleText()).toEqual('Welcome to design-front!');
  // });

});
