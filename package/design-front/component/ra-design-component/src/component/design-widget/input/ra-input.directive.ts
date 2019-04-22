import {
  Directive, ElementRef,
  Input,
  Optional, Renderer2,
  Self
} from '@angular/core';
import { NgControl } from '@angular/forms';
import {NzInputDirective} from 'ng-zorro-antd';

@Directive({
  selector: '[design-input]',
  host    : {
    '[class.ant-input-disabled]': 'disabled',
    '[class.ant-input-lg]'      : `nzSize === 'large'`,
    '[class.ant-input-sm]'      : `nzSize === 'small'`
  }
})
export class RaInputDirective extends NzInputDirective {
  constructor(@Optional() @Self() public ngControl: NgControl, renderer: Renderer2, elementRef: ElementRef) {
    super(ngControl, renderer, elementRef);
  }
}
