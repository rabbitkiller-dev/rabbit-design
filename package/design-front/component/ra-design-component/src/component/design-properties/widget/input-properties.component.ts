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
    <form>
      <div [ngSwitch]="type">
        <ng-container *ngSwitchCase="InputPropertiesEnum.Enum_Input">
        </ng-container>
        <ng-container *ngSwitchCase="InputPropertiesEnum.Enum_Selector">
          <nz-form-item>
            <nz-form-label [nzSm]="6">{{label}}</nz-form-label>
            <nz-form-control [nzSm]="18">
              <nz-select
                nzDropdownClassName="design-select"
                nzShowSearch
                nzAllowClear
                nzPlaceHolder="Select a person"
                name="enum-selector"
                [ngModel]="value"
                (ngModelChange)="valueChange.emit($event)"
                [disabled]="disabled">
                <nz-option *ngFor="let item of option" [nzLabel]="item.label" [nzValue]="item.value"></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </ng-container>
        <ng-container *ngSwitchDefault>
          <nz-form-item>
            <nz-form-label [nzSm]="6">{{label}}</nz-form-label>
            <nz-form-control [nzSm]="18">
              <input nz-input name="default" [ngModel]="value" (ngModelChange)="valueChange.emit($event)" [disabled]="disabled">
            </nz-form-control>
          </nz-form-item>
        </ng-container>
      </div>
    </form>
  `
})
export class InputPropertiesComponent {
  InputPropertiesEnum: any = InputPropertiesEnum;
  @Input() type: InputPropertiesEnum;
  @Input() label: string;
  @Input() value: any;
  @Input() disabled: boolean = false;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  // Enum_Selector
  @Input() option: Array<{label: string, value: any}>;
}
