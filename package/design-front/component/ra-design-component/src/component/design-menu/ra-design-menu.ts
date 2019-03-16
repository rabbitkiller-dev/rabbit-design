import {Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild} from '@angular/core';
import {DesignMenuModel} from './interface';
import {RaDesignMenuService} from './ra-design-menu.service';

@Component({
  selector: 'ra-design-menu',
  template: `
    <div class="ra-design-menu" #container>
      <ra-design-menu-item *ngFor="let item of model" [model]="item"
                           (clickMenu)="emitClickMenu($event)"></ra-design-menu-item>
    </div>
  `,
  styles: []
})
export class RaDesignMenu {

  public preventDocumentDefault: boolean;
  documentClickListener: any;

  @ViewChild('container') container: ElementRef;
  @Input() model: DesignMenuModel[]; // is tree data
  @Output() modelChange: EventEmitter<DesignMenuModel> = new EventEmitter<DesignMenuModel>();
  @Output() clickMenu: EventEmitter<DesignMenuModel> = new EventEmitter<DesignMenuModel>();

  constructor(public renderer: Renderer2, public RaDesignMenuService: RaDesignMenuService) {
    this.RaDesignMenuService.subject.subscribe((event) => {
      console.log(event);
      this.preventDocumentDefault = true;
      this.model = event.item;
      this.container.nativeElement.style.display = 'block';
      this.container.nativeElement.style.top = event.y + 'px';
      this.container.nativeElement.style.left = event.x + 'px';
      this.bindDocumentClickListener();
    });
  }

  toggle($event) {
    if (this.preventDocumentDefault) {
      this.hide();
    } else {
      this.show($event);
    }
  }

  show($event: MouseEvent) {
    this.preventDocumentDefault = true;
    this.container.nativeElement.style.display = 'block';
    let x = 0;
    let y = 0;
    const rect = this.container.nativeElement.getBoundingClientRect();
    if ($event.pageY + rect.height > document.documentElement.clientHeight) {
      y = document.documentElement.clientHeight - rect.height - 5;
    } else {
      y = $event.pageY;
    }
    if ($event.pageX + rect.width > document.documentElement.clientWidth) {
      x = document.documentElement.clientWidth - rect.width;
    } else {
      x = $event.pageX;
    }
    this.container.nativeElement.style.top = y + 'px';
    this.container.nativeElement.style.left = x + 'px';
    this.bindDocumentClickListener();
  }

  hide() {
    this.preventDocumentDefault = false;
    this.container.nativeElement.style.display = 'none';
    this.unbindDocumentClickListener();
  }

  bindDocumentClickListener() {
    if (!this.documentClickListener) {
      this.documentClickListener = this.renderer.listen('document', 'click', () => {
        if (this.preventDocumentDefault) {
          this.hide();
        }
        this.preventDocumentDefault = false;
      });
    }
  }

  unbindDocumentClickListener() {
    if (this.documentClickListener) {
      this.documentClickListener();
      this.documentClickListener = null;
    }
  }

  emitClickMenu($event: DesignMenuModel) {
    this.hide();
    this.clickMenu.emit($event);
    this.RaDesignMenuService.emit($event);
  }
}
