import {
  ChangeDetectorRef,
  Compiler,
  Component,
  ComponentRef, ElementRef, ModuleWithComponentFactories,
  NgModule,
  OnDestroy,
  OnInit,
  ViewContainerRef
} from '@angular/core';
import {Throttle} from '../../design-dynamic/throttle';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RaDesignDynamicUnitModule} from '../../design-dynamic/ra-design-dynamic-unit.module';
import {NzIconModule, NzInputModule} from 'ng-zorro-antd';
import {PropertiesEditorService} from './properties-editor.service';

@Component({
  template: `
    <div class="ra-design-tools-title">
      <i class="fa fa-first-order"></i>
      <label>属性管理</label>
    </div>
  `,
  styles: []
})
export class PropertiesEditorInterface implements OnInit {
  panel: string;
  comRef: ComponentRef<any>;

  constructor(
    private vcRef: ViewContainerRef,
    private cdr: ChangeDetectorRef,
    private compiler: Compiler,
    private PropertiesEditorService: PropertiesEditorService,
  ) {
    this.PropertiesEditorService.PropertiesEditorInterface = this;
  }

  ngOnInit(): void {
  }

  createModule() {
    const master = this.createComponent('ra-design-properties-editor', this.panel);

    @NgModule({
      imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, RaDesignDynamicUnitModule,
        NzIconModule, NzInputModule],
      declarations: [master],
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
      this.vcRef.clear();
      // const injector = ReflectiveInjector.fromResolvedProviders([], this.vcRef.parentInjector);
      this.comRef = this.vcRef.createComponent(factory, 0);
      this.cdr.markForCheck();
    });
  }

  createComponent(selector: string, html: string) {
    @Component({
      selector: selector,
      template: html,
      styles: [],
      // encapsulation: ViewEncapsulation.Native,
    })
    class DynamicComponent implements OnInit {

      constructor(public ElementRef: ElementRef) {
      }

      ngOnInit() {
      }
    }

    return DynamicComponent;
  }
}
