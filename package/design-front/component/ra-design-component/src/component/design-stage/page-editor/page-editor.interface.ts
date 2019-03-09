import {
  ChangeDetectorRef,
  Compiler,
  Component,
  ElementRef,
  ModuleWithComponentFactories,
  NgModule,
  OnDestroy,
  OnInit, ReflectiveInjector,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {RaDesignDragDirective, RaDesignDropDirective} from '../../design-drag-drop';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzInputModule} from 'ng-zorro-antd';

@Component({
  template: `
    <div style="height: 100%;display: flex;flex-direction: column;">
      <div id="tools-page-editor__dropList" style="flex: 1;
    background: #999;
    background-image: linear-gradient(45deg, #666 25%, transparent 0, transparent 75%, #666 0), linear-gradient(45deg, #666 25%, transparent 0, transparent 75%, #666 0);
    background-position: 0 0, 15px 15px;
    background-size: 30px 30px;
" designDrop >
        <ng-template #dynamic></ng-template>
      </div>
      <div class="editor-stage-footer">
      </div>
    </div>
  `,
  styles: []
})
export class PageEditorInterface implements OnInit {
  @ViewChild('dynamic', {read: ViewContainerRef}) dynamic: ViewContainerRef;
  html: string = `
  <input nz-input>
  `;

  constructor(private compiler: Compiler,
              private ChangeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.createModule();
    // this.dynamic.createComponent()
  }

  oncdkDropListEntered($event) {
    console.log($event);
  }

  // enterPredicate(drag: RaDesignDragDirective<any>, drop: RaDesignDropDirective<any>) {
  //   return drag.designDragType === 'tools-component';
  // }

  onDesignDropped($event) {

  }

  createModule() {
    const __this = this;

    const master = __this.createComponent('ra-design-dynamic', __this.html + '<page-cccc></page-cccc>');

    @NgModule({
      imports: [CommonModule, FormsModule, ReactiveFormsModule, NzInputModule],
      declarations: [master, __this.createComponent('page-cccc', '<div>嵌套页面</div>')],
    })
    class DynamicModule {
    }

    this.compiler.compileModuleAndAllComponentsAsync(DynamicModule)
      .then((compiled: ModuleWithComponentFactories<any>) => {
        const factory = compiled.componentFactories.find(x =>
          x.componentType === master);
        return factory;
      }).then((factory) => {
      this.dynamic.createComponent(factory);
      this.ChangeDetectorRef.markForCheck();
    });
    // .then((moduleWithComponentFactory: ModuleWithComponentFactories<any>) =>
    //   moduleWithComponentFactory.componentFactories.find(x =>
    //     x.componentType === master))
    // .then(factory => {
    //   this.dynamic.clear();
    //   const injector = ReflectiveInjector.fromResolvedProviders([], this.dynamic.parentInjector);
    //   this.dynamic.createComponent(factory, 0, injector);
    // });

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
