import {
  AfterViewInit,
  Component,
} from '@angular/core';
import {RaDesignHeaderService} from './ra-design-header.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ra-design-header',
  templateUrl: './ra-design-header.component.html',
  styles: []
})
export class RaDesignHeaderComponent implements AfterViewInit {
  languageList: Array<{ label: string, language: string }> = [
    {label: 'English', language: 'en_US'},
    {label: '简体中文', language: 'zh_CN'},
  ]
  showLanguage: boolean = false;

  constructor(
    public RaDesignHeaderService: RaDesignHeaderService,
    public TranslateService: TranslateService,
  ) {
  }

  ngAfterViewInit() {
  }

  changeLanguage(language: string) {
    this.TranslateService.use(language);
  }
}
