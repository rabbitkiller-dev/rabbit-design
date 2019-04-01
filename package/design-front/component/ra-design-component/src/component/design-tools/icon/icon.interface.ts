import {AfterViewInit, Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {IconService} from './icon.service';
import {RaDesignToolsInterface} from '../ra-design-tools.interface';

@Component({
  template: `
    <div class="ra-design-side-bar-interface-title">
      <label>{{'icons' | translate}}</label>
      <li class="minimize" (click)="minimize()"><i nz-icon type="rabbit-design:icon-nav-left"></i></li>
    </div>
    <div class="ra-design-side-bar-interface-content">
      <li *ngFor="let icon of icons">
        <i nz-icon [type]="'rabbit-design:'+icon.fontClass"></i>
      </li>
    </div>
  `,
  styles: []
})
export class IconInterface extends RaDesignToolsInterface {
  icons: any[];

  constructor(public IconService: IconService, public Injector: Injector) {
  super(Injector);
    this.IconService.index().subscribe((icons) => {
      this.icons = icons;
    });
  }
}
