import {browser, by, element} from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  waitStageBar() {
    return browser.wait(function () {
      return browser.isElementPresent(by.css('.stage-bar.cdk-drop-list li'));
    }, 20000);
  }

  getTitleText() {
    return element.all(by.css('.stage-bar.cdk-drop-list li'))[0].get(0).getText();
  }
}
