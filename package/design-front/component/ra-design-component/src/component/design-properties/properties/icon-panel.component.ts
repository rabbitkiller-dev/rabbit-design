import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {HtmlJson} from 'himalaya';
import {NzIconDirective} from '../../design-dynamic/nz-module/icon';

@Component({
  selector: 'ra-design-icon-panel',
  template: `
    <ra-design-input-properties label="type" [value]="instance.type"
                                (valueChange)="change('type', $event)"></ra-design-input-properties>
    <ra-design-input-properties label="theme" [value]="instance.theme"
                                (valueChange)="change('theme', $event)"></ra-design-input-properties>

  `
})
export class IconPanelComponent {
  @Input() nodeJson: HtmlJson;
  @Input() instance: NzIconDirective;
  id: number;

  constructor(private cdr: ChangeDetectorRef) {

  }

  change(key, $event) {
    let attr;
    switch (key) {
      case 'type':
        attr = this.nodeJson.attributes.find((attr) => {
          return attr.key === 'type'; // TODO nzType
        }) || {
          key: 'type',
          value: '',
        };
        attr.value = $event;
        this.instance.type = $event;
        break;
      case 'theme':
        attr = this.nodeJson.attributes.find((attr) => {
          return attr.key === 'theme'; // TODO nzTheme
        }) || {
          key: 'theme',
          value: '',
        };
        attr.value = $event;
        this.instance.theme = $event;
        break;
    }
    clearTimeout(this.id);
    this.id = setTimeout(() => {
      this.instance.ngOnChanges({theme: true} as any);
    }, 200);
  }
}
