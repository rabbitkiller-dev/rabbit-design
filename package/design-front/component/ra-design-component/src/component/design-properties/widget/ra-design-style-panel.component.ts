import {Component, Input} from '@angular/core';
import {HtmlJson} from 'himalaya';

@Component({
  selector: 'ra-design-icon-panel',
  template: `
  `
})
export class IconPanelComponent {
  @Input() nodeJson: HtmlJson;
  constructor() {
  }
}
