import {Component, ElementRef, Input} from '@angular/core';
import {RaDesignKeyMapService, WINDOW_NAME} from '../design-key-map/ra-design-key-map.service';

@Component({
  selector: 'ra-design-dialog',
  template: `
    <div class="ra-design-dialog" designDrag="relative">
      <div class="ra-design-dialog__message">{{header}}</div>
      <ng-content></ng-content>
    </div>
  `
})
export class RaDesignDialogComponent {
  @Input() header: string;

  constructor(
    public ElementRef: ElementRef,
    public RaDesignKeyMapService: RaDesignKeyMapService,
  ) {
    this.RaDesignKeyMapService.registerListenerWindow(WINDOW_NAME.Dialog, this.ElementRef.nativeElement).subscribe(() => {

    });
  }
}
