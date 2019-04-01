import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'design-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'design-front';

  constructor(public TranslateService: TranslateService) {
    this.TranslateService.use('zh_CN');
    this.TranslateService.setDefaultLang('en_US');
  }

}
