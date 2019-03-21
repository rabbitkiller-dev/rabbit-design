import {Component, Input} from '@angular/core';

@Component({
  selector: 'ra-design-dialog',
  template: `
    <div class="ra-design-dialog">
      <div class="ra-design-dialog__message">{{header}}</div>
      <ng-content></ng-content>
    </div>
  `
})
export class RaDesignDialogComponent {
  @Input() header: string;
}
