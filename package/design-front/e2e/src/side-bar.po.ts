import {browser, by, element, promise as wdpromise} from 'protractor';

export class SideBarPo {
  wait(): wdpromise.Promise<any> {
    return browser.isElementPresent(by.css('.side-bar-label'));
  }

  async clickSideBar(name) {
    await this.wait();
    element(by.css('.side-bar-label')).element(by.binding(name)).click();
  }

  async click() {
    element(by.css('ra-design-tree-node')).click();
  }
}
