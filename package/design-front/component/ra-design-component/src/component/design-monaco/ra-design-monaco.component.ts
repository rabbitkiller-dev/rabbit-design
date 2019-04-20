import {Component, ElementRef, forwardRef, Inject, Input, NgZone, ViewChild} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {fromEvent} from 'rxjs';
import {Monaco} from './monaco';
import {HttpService} from 'ra-component';

@Component({
  selector: 'ra-design-monaco',
  template: `
    <div class="editor-container" #editorContainer></div>`,
  styles: [`
    :host {
      display: block;
      height: 200px;
    }

    .editor-container {
      width: 100%;
      height: 98%;
    }
  `],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RaDesignMonacoComponent),
    multi: true
  }]
})
export class RaDesignMonacoComponent extends Monaco {
  @ViewChild('editorContainer') editorContainer: ElementRef;
  @Input() initMonaco = (options: any) => {
    this.editor = (window as any).monaco.editor.create(this.editorContainer.nativeElement, options);
    this.editor.setValue(this.value);
    this.editor.onDidChangeModelContent((e: any) => {
      const value = this.editor.getValue();
      this.propagateChange(value);
      // value is not propagated to parent when executing outside zone.
      this.zone.run(() => this.value = value);
    });

    this.editor.onDidBlurEditor((e: any) => {
      this.onTouched();
    });

    // refresh layout on resize event.
    if (this.windowResizeSubscription) {
      this.windowResizeSubscription.unsubscribe();
    }
    this.windowResizeSubscription = fromEvent(window, 'resize').subscribe(() => this.editor.layout());
    this.onInit.emit(this.editor);
  };

  constructor(
    protected zone: NgZone,
    public HttpService: HttpService,
  ) {
    super(zone, HttpService);
  }

}
