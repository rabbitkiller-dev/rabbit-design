import {
  Compiler,
  Component,
  ComponentRef,
  ElementRef,
  Injector,
  ModuleWithComponentFactories,
  NgModule,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RaDesignDynamicUnitModule} from '../../design-dynamic/ra-design-dynamic-unit.module';
import {NzIconModule, NzInputModule} from 'ng-zorro-antd';
import {PropertiesEditorService} from './properties-editor.service';
import {RaDesignToolsInterface} from '../ra-design-tools.interface';
import {RUNTIME_EVENT_ENUM, RuntimeEventService} from '../../design-runtime/runtime-event.service';
import {PageEditorService} from '../../design-stage/page-editor/page-editor.service';
import {StageTabModel} from 'ra-design-component';

@Component({
  template: `
    <div class="ra-design-side-bar-interface-title">
      <label>属性管理</label>
      <li class="minimize" (click)="minimize()"><i nz-icon type="rabbit-design:icon-nav-left"></i></li>
    </div>
    <ng-template #content></ng-template>
  `,
  styles: []
})
export class PropertiesEditorInterface extends RaDesignToolsInterface implements OnInit {
  currentStage: StageTabModel;
  panel: string;
  @ViewChild('content', {read: ViewContainerRef}) content: ViewContainerRef;
  comRef: ComponentRef<any>;

  constructor(
    public Injector: Injector,
    private compiler: Compiler,
    private PropertiesEditorService: PropertiesEditorService,
    private PageEditorService: PageEditorService,
  ) {
    super(Injector);
    this.initEvent();
  }

  initEvent() {
    this.RuntimeEventService.on<StageTabModel>(RUNTIME_EVENT_ENUM.Stage_Open, (value) => {
      this.currentStage = value;
      this.changePanel();
    });
    this.RuntimeEventService.on(RUNTIME_EVENT_ENUM.StagePageEditor_SelectionChange, () => {
      this.changePanel();
    });
  }

  changePanel() {
    if (!this.currentStage) {
      this.destroy();
      return;
    }
    const selection = this.PageEditorService.getSelection(this.currentStage.id);
    // 只处理选择了一个组件的情况
    if (selection.length !== 1) {
      return;
    }
    const nodeJson = this.PageEditorService.getNodeJson(selection[0]);
  }

  ngOnInit(): void {
  }

  destroy() {
    if (this.comRef) {
      this.comRef.destroy();
    }
    this.content.clear();
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
      this.destroy();
      this.comRef = this.content.createComponent(factory, 0);
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
