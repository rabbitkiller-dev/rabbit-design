import {
  ChangeDetectorRef,
  Compiler,
  Component, ComponentRef,
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
import {parse, stringify, HtmlJson} from 'himalaya';
import {PageEditorService} from './page-editor.service';

@Component({
  selector: 'ra-design-page-editor',
  template: `
    <div class="page-editor" style="">
      <div class="page-editor__form" designDrop="page-editor">
        <ng-template #dynamicTemplate></ng-template>
      </div>
      <div class="editor-stage-footer">
      </div>
    </div>
  `,
  styles: []
})
export class PageEditorInterface implements OnInit {
  @ViewChild('.page-editor__form', {read: ViewContainerRef}) editor: ViewContainerRef;
  @ViewChild('dynamicTemplate', {read: ViewContainerRef}) dynamicTemplate: ViewContainerRef;
  htmlJson: HtmlJson[] = [];
  dynamicComponent: ComponentRef<any>;

  constructor(private compiler: Compiler,
              private ChangeDetectorRef: ChangeDetectorRef,
              public PageEditorService: PageEditorService) {
    this.PageEditorService.PageEditorInterface = this;
  }

  ngOnInit() {
    this.createModule();
  }


  createModule() {
    if (this.dynamicComponent) {
      this.compiler.clearCache();
      // this.compiler.getModuleId(DynamicModule);
    }
    const __this = this;

    const master = __this.createComponent('ra-design-dynamic', stringify(__this.htmlJson));

    @NgModule({
      imports: [CommonModule, FormsModule, ReactiveFormsModule, NzInputModule],
      declarations: [master],
      // declarations: [master, __this.createComponent('page-cccc', '<div>嵌套页面</div>')],
    })
    class DynamicModule {
    }
    this.compiler.compileModuleAndAllComponentsAsync(DynamicModule)
      .then((compiled: ModuleWithComponentFactories<any>) => {
        const factory = compiled.componentFactories.find(x =>
          x.componentType === master);
        return factory;
      }).then((factory) => {
      this.dynamicComponent = this.dynamicTemplate.createComponent(factory);
      this.ChangeDetectorRef.markForCheck();
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
