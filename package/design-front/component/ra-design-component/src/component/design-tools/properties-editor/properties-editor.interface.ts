import {
  Compiler,
  Component,
  ComponentRef,
  ElementRef,
  Injector,
  ModuleWithComponentFactories,
  NgModule,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RaDesignDynamicUnitModule} from '../../design-dynamic/ra-design-dynamic-unit.module';
import {NzFormModule, NzIconModule, NzInputModule} from 'ng-zorro-antd';
import {PropertiesEditorService} from './properties-editor.service';
import {RaDesignToolsInterface} from '../ra-design-tools.interface';
import {RUNTIME_EVENT_ENUM} from '../../design-runtime/runtime-event.service';
import {PageEditorService} from '../../design-stage/page-editor/page-editor.service';
import {RaDesignStageService, StageTabModel} from '../../design-stage';
import {DesignHtmlJson} from '../../design-stage/page-editor/interface';
import {RaDesignWidgetModule} from '../../design-widget/ra-design-widget.module';
import {parserDirective} from '../../design-dynamic/parser-directive';
import {Attributes} from 'himalaya';
import {RaDesignPropertiesModule} from '../../design-properties/ra-design-properties.module';

@Component({
  template: `
    <div class="ra-design-side-bar-interface-title">
      <label>{{'properties' | translate}}</label>
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
  nodeJson: DesignHtmlJson;
  instance: any;

  constructor(
    public Injector: Injector,
    private compiler: Compiler,
    private PropertiesEditorService: PropertiesEditorService,
    private PageEditorService: PageEditorService,
    private RaDesignStageService: RaDesignStageService,
  ) {
    super(Injector);
    this.initEvent();
  }

  initEvent() {
    this.RuntimeEventService.on(RUNTIME_EVENT_ENUM.Stage_Click, (value) => {
      this.currentStage = value;
      this.changePanel();
    });
    this.RuntimeEventService.on(RUNTIME_EVENT_ENUM.StagePageEditor_DynamicAfterViewInit, (value) => {
      this.currentStage = this.RaDesignStageService.stageMap.get(value);
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
      this.destroy();
      return;
    }
    const nodeJson = this.nodeJson = this.PageEditorService.getNodeJson(selection[0]);
    this.instance = this.PageEditorService.dynamicUnits.get(this.currentStage.id).get(nodeJson.RabbitID).ref;
    this.panel = this.PropertiesEditorService.getPanel(nodeJson);
    this.createModule();
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
        NzFormModule,
        RaDesignWidgetModule, RaDesignPropertiesModule,
        NzIconModule, NzInputModule],
      declarations: [master],
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
      this.comRef.instance.setInstance(this.instance);
      this.comRef.instance.setNodeJson(this.nodeJson);
    });
  }

  createComponent(selector: string, html: string) {
    @Component({
      selector: selector,
      template: html,
      styles: [],
      // encapsulation: ViewEncapsulation.Native,
    })
    class DynamicComponent implements OnInit, OnChanges {
      directive: string[];
      instance;
      nodeJson: DesignHtmlJson;
      RabbitID: Attributes;

      constructor(public ElementRef: ElementRef) {
      }

      ngOnInit() {
      }

      ngOnChanges(simple: SimpleChanges) {
      }

      setNodeJson(nodeJson) {
        this.directive = parserDirective(nodeJson);
        this.nodeJson = nodeJson;
        this.RabbitID = this.nodeJson.attributes.find((attr) => attr.key === 'RabbitID' || attr.key === '[RabbitID]');
      }

      setInstance(instance: any) {
        this.instance = new Proxy<any>(instance, {
          set: (target, p, value, receiver) => {
            console.log(value);
            return true;
          }
        });
      }
    }

    return DynamicComponent;
  }


}
