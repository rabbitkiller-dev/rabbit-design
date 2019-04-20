import {AppPage} from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', async () => {
    page.navigateTo();
    const a = await page.waitStageBar();
    expect(a).toEqual(true);

    // expect(page.getTitleText()).toEqual('Welcome to design-front!');
  });
});
