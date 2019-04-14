import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 枚举-输入框
  变量-枚举项
 枚举-选择框
  变量-枚举项
 变量-输入框
  变量-全局变量/局部变量
 字符串
 选择框-全局变量
 变量-all/xxx
 url
 输入框-全局变量
 字符串
 选择框-全局变量
 api选择器
 图标
 图标选择器
 输入框-全局变量
 字符串
 *
 */
enum InputPropertiesEnum {
  Enum_Input,
  Enum_Selector,
}

@Component({
  selector: 'ra-design-input-properties',
  template: `
    <nz-form-item>
      <nz-form-label [nzSm]="6">{{label}}</nz-form-label>
      <nz-form-control [nzSm]="18">
        <input design-input [ngModel]="value" (ngModelChange)="valueChange.emit($event)">
      </nz-form-control>
    </nz-form-item>
  `
})
export class InputPropertiesComponent {
  @Input() type: InputPropertiesEnum;
  @Input() label: string;
  @Input() value: any;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
}
