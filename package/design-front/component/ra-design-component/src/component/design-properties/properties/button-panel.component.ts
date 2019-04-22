import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {HtmlJson} from 'himalaya';
import {NzButtonComponent, NzButtonType} from '../../design-dynamic/nz-module/button';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {RaDesignTreeService} from 'ra-design-component';

@Component({
  selector: 'ra-design-button-panel',
  template: `
    <ra-design-input-properties label="type" [value]="instance.nzType" [type]="1"
                                (valueChange)="change('nzType', $event)"
                                [option]="nzTypeOption"></ra-design-input-properties>
    <ra-design-input-properties label="type" [value]="instance.nzSize"
                                (valueChange)="change('nzSize', $event)"></ra-design-input-properties>

  `
})
export class ButtonPanelComponent implements OnInit {
  @Input() nodeJson: HtmlJson;
  @Input() instance: NzButtonComponent;
  id: any;
  nzTypeOption: Array<{ label: string, value: NzButtonType }> = [];

  constructor(public TranslateService: TranslateService) {

  }

  ngOnInit() {
    this.TranslateService.onLangChange.subscribe(this.translateComponentTitle.bind(this));
    this.translateComponentTitle();
  }

  translateComponentTitle(event?: LangChangeEvent) {
    this.nzTypeOption = [];
    this.nzTypeOption.push(this._generateTypeOption('primary'));
    this.nzTypeOption.push(this._generateTypeOption('dashed'));
    this.nzTypeOption.push(this._generateTypeOption('danger'));
    this.nzTypeOption.push(this._generateTypeOption('default'));
  }

  _generateTypeOption(type: NzButtonType): { label: string, value: NzButtonType } {
    const result: any = {};
    result.value = type;
    this.TranslateService.get(type).subscribe((value) => {
      result.label = value;
    });
    return result;
  }

  change(key, $event) {
    let attr;
    switch (key) {
      case 'nzType':
        attr = this.nodeJson.attributes.find((attr) => {
          return attr.key === 'nzType';
        }) || {
          key: 'nzType',
          value: '',
        };
        attr.value = $event;
        this.instance.nzType = $event;
        break;
      case 'nzSize':
        attr = this.nodeJson.attributes.find((attr) => {
          return attr.key === 'nzSize';
        }) || {
          key: 'nzSize',
          value: '',
        };
        attr.value = $event;
        this.instance.nzSize = $event;
        break;
    }
    clearTimeout(this.id);
    this.id = setTimeout(() => {
      this.instance.ngOnChanges({nzType: true} as any);
    }, 200);
  }
}
