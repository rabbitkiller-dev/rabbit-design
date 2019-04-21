import {
  AfterViewInit,
  Compiler,
  Component,
  ComponentRef,
  Directive,
  ElementRef,
  Input,
  ModuleWithComponentFactories,
  NgModule,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
// Rendering ElComponent dependence
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Throttle} from '../design-unit/throttle';
import {RaDesignDynamicUnitModule} from './ra-design-dynamic-unit.module';
import {NgZorroAntdModule} from './nz-module/ng-zorro-antd.module';
import {RUNTIME_EVENT_ENUM, RuntimeEventService} from '../design-runtime/runtime-event.service';
import {PageEditorService} from '../design-stage/page-editor/page-editor.service';

@Directive({
  selector: '[design-dynamic]',
})
export class RaDesignDynamicDirective implements OnInit {
  _ordDynamicHtml: string;
  _dynamicHtml: string;
  _dynamicScss: string;
  _dynamicFormData: any;

  dynamicChange: Throttle = new Throttle(1000);

  @Input() stageID: string;

  @Input('design-dynamic') set dynamicHtml(html: string) {

    this.dynamicChange.destroy();
    this.dynamicChange.execute(() => {
      try {
        this._dynamicHtml = html || ' ';
        this.createModule();
        this._ordDynamicHtml = this.dynamicHtml;
      } catch (e) {
        console.error(e);
        this.dynamicHtml = this._ordDynamicHtml;
      }
    });
  }

  get dynamicHtml(): string {
    return this._dynamicHtml || '';
  }

  @Input() dynamicTime: number = 100;
  comRef: ComponentRef<any>;

  constructor(
    private vcRef: ViewContainerRef,
    private PageEditorService: PageEditorService,
    private compiler: Compiler,
  ) {
  }

  ngOnInit(): void {
    this.dynamicChange.time = this.dynamicTime;
  }

  createModule() {
    const master = this.createComponent('ra-design-dynamic', this._dynamicHtml);
    const pageCCC = this.createComponent('page-cccc', '<div>嵌套页面</div>');

    @NgModule({
      imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, RaDesignDynamicUnitModule,
        NgZorroAntdModule],
      declarations: [master, pageCCC],
      // declarations: [master, __this.createComponent('page-cccc', '<div>嵌套页面</div>')],
    })
    class DynamicModule {
    }

    this.compiler.compileModuleAndAllComponentsAsync(DynamicModule)
      .then((compiled: ModuleWithComponentFactories<any>) => {
        const factory = compiled.componentFactories.find(x => x.componentType === master);
        return factory;
      }).then((factory) => {
      if (this.comRef) {
        this.comRef.destroy();
      }
      this.PageEditorService.dynamicUnits.delete(this.stageID);
      this.PageEditorService.dynamicUnits.set(this.stageID, new Map());
      this.vcRef.clear();
      this.comRef = this.vcRef.createComponent(factory, 0);
      this.comRef.instance.stageID = this.stageID;
    });
  }

  createComponent(selector: string, html: string) {
    @Component({
      selector: selector,
      template: html,
      styles: [],
      // encapsulation: ViewEncapsulation.Native,
    })
    class DynamicComponent implements OnInit, AfterViewInit {
      stageID: string;

      constructor(
        public ElementRef: ElementRef,
        public RuntimeEventService: RuntimeEventService,
      ) {
      }

      ngOnInit() {
      }

      ngAfterViewInit() {
        setTimeout(() => {
          this.RuntimeEventService.emit(RUNTIME_EVENT_ENUM.StagePageEditor_DynamicAfterViewInit, this.stageID);
        });
      }
    }

    return DynamicComponent;
  }
}
