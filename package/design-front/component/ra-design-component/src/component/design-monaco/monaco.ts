import {AfterViewInit, Component, EventEmitter, forwardRef, Inject, Input, NgZone, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Subscription} from 'rxjs';
import {HttpService} from 'ra-component';


let loadedMonaco: boolean = false;
let loadPromise: Promise<void>;

@Component({
  template: '',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Monaco),
    multi: true
  }]
})
export class Monaco implements AfterViewInit, ControlValueAccessor {
  @Output() onInit = new EventEmitter<any>();
  @Input() initMonaco: any;
  public value: string = '';
  public editor: any;
  public windowResizeSubscription: Subscription;
  propagateChange = (_: any) => {
  };
  onTouched = () => {
  };

  constructor(
    protected zone: NgZone,
    public HttpService: HttpService,
  ) {
  }

  public _options: any;

  get options(): string {
    return this._options;
  }

  @Input('options')
  set options(options: string) {
    this._options = Object.assign({}, options);
    if (this.editor) {
      this.editor.dispose();
      this.initMonaco(options);
    }
  }

  writeValue(value: any): void {
    this.value = value || '';
    // Fix for value change while dispose in process.
    setTimeout(() => {
      if (this.editor) {
        this.editor.setValue(this.value);
      }
    });

  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngAfterViewInit(): void {
    this.HttpService.require(['vs/editor/editor.main'], {paths: {vs: 'assets/monaco-editor'}})
      .subscribe(() => {
        this.initMonaco(this.options);
      });
  }

}
