import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {IconService} from './icon.service';

@Component({
  template: `
    <div class="ra-design-side-bar-interface-title">
      <i class="fa fa-first-order"></i>
      <label>图标管理</label>
    </div>
    <div class="ra-design-side-bar-interface-content">
      <li *ngFor="let icon of icons">
        <i nz-icon [type]="'rabbit-design:'+icon.fontClass"></i>
        <span class="anticon-class">{{icon.fontClass}}</span>
      </li>
    </div>
  `,
  styles: []
})
export class IconInterface {
  icons: any[];

  constructor(public IconService: IconService) {
    this.IconService.index().subscribe((icons) => {
      this.icons = icons;
    });
  }
}
