import {
  Input, Directive, OnInit, Compiler, Component,
  ModuleWithComponentFactories, NgModule, ReflectiveInjector, ViewContainerRef, ComponentRef, ErrorHandler, ElementRef,
  ViewEncapsulation,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

// Rendering ElComponent dependence
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Throttle} from './throttle';


@Directive({
  selector: '[ra-design-dynamic]',
})
export class RaDesignDynamicDirective implements OnInit {
  _ordDynamicHtml: string;
  _dynamicHtml: string;
  _dynamicScss: string;
  _dynamicFormData: any;

  dynamicChange: Throttle = new Throttle(1000);

  @Input('ra-design-dynamic') set dynamicHtml(html: string) {

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

  @Input() dynamicTime: number = 1000;
  comRef: ComponentRef<any>;

  constructor(
    private vcRef: ViewContainerRef,
    private compiler: Compiler,
  ) {
  }

  ngOnInit(): void {
    this.dynamicChange = new Throttle(this.dynamicTime);
  }

  createModule() {
    const master = this.createComponent('ra-design-dynamic', this._dynamicHtml);
    @NgModule({
      imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule,],
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
        const injector = ReflectiveInjector.fromResolvedProviders([], this.vcRef.parentInjector);
        this.comRef = this.vcRef.createComponent(factory, 0, injector);
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
