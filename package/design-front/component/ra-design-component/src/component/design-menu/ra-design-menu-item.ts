import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {DesignMenuModel} from './interface';

@Component({
  selector: 'ra-design-menu-item',
  template: `
    <div class="ra-design-menu-item"
         (mouseenter)="onItemMouseEnter($event)"
         (mouseleave)="onItemMouseLeave($event)"
         (click)="emitClickMenu($event)">
      <i nz-icon *ngIf="model.icon" [type]="model.icon"></i>
      <!--<span *ngIf="model.icon" class="ra-design-menu-item_icon fa {{model.icon}}"></span>-->
      <span class="">{{ model.label }}</span>
      <span class="ra-design-menu-item_shortcut">{{ model.shortcut }}</span>
      <span *ngIf="model.items && model.items.length>0"
            class="ra-design-menu-item_nexticon fa fa-caret-right"></span>
      <div #itemList class="ra-design-menu-item_list">
        <ra-design-menu-item *ngFor="let item of model.items"
                          [model]="item" (clickMenu)="clickMenu.emit($event)">
        </ra-design-menu-item>
      </div>
    </div>
  `,
  styles: []
})
export class RaDesignMenuItem {
  @ViewChild('itemList') itemList: ElementRef;
  @Input() model: DesignMenuModel; // is tree data
  @Output() modelChange: EventEmitter<DesignMenuModel> = new EventEmitter<DesignMenuModel>();
  @Output() clickMenu: EventEmitter<DesignMenuModel> = new EventEmitter<DesignMenuModel>();

  constructor() {
  }

  onItemMouseEnter($event: MouseEvent) {
    if (this.model.items && this.model.items.length > 0) {
      this.itemList.nativeElement.style.display = 'block';
      const target = $event.target as HTMLDivElement;
      const itemListRect = this.itemList.nativeElement.getBoundingClientRect();
      const rect = target.getBoundingClientRect();
      let x: number;
      let y: number;
      if (rect.left + rect.width + itemListRect.width > document.documentElement.clientWidth) {
        x = rect.left - itemListRect.width;
      } else {
        x = rect.left + rect.width;
      }
      if (rect.top + itemListRect.height > document.documentElement.clientHeight) {
        y = document.documentElement.clientHeight - itemListRect.height + 2.5;
      } else {
        y = rect.top;
      }
      this.itemList.nativeElement.style.top = y + 'px';
      this.itemList.nativeElement.style.left = x + 'px';
    }
  }

  onItemMouseLeave($event: MouseEvent) {
    this.itemList.nativeElement.style.display = 'none';
  }

  emitClickMenu($event: MouseEvent) {
    $event.stopPropagation();
    if (this.model.items && this.model.items.length > 0) {
      return;
    }
    this.clickMenu.emit(this.model);
  }
}
