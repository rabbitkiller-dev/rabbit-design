import {ComponentFactory, ComponentFactoryResolver, Injectable, ViewContainerRef} from '@angular/core';
import {StageTabModel, StageTabServerModel} from './interface';
import {RaDesignStageComponent} from './ra-design-stage.component';
import {PageEditorInterface} from './page-editor/page-editor.interface';

export enum StageFactory {
  PageEditor = 'pageEditor',
}

@Injectable()
export class RaDesignStageService {
  private stageMap: Map<string, StageTabModel> = new Map();
  private stageList: StageTabModel[] = [];
  private factory: Map<String, ComponentFactory<any>> = new Map();
  private RaDesignStageComponent: RaDesignStageComponent;

  constructor(public ComponentFactoryResolver: ComponentFactoryResolver) {
  }

  init(RaDesignStageComponent: RaDesignStageComponent) {
    this.RaDesignStageComponent = RaDesignStageComponent;
    this.factory.set(StageFactory.PageEditor, this.ComponentFactoryResolver.resolveComponentFactory(PageEditorInterface));
  }

  openStage(tools: StageFactory, stageTabServer: StageTabServerModel) {
    switch (tools) {
      case StageFactory.PageEditor:
        const stage = {
          factory: StageFactory.PageEditor,
          icon: 'database',
          ...stageTabServer,
        };
        this.stageList.push(stage);
        this.stageMap.set(stageTabServer.id, stage);
        break;
      default:
        throw new Error('NotStageFactory');
    }

    this.stageMap.get(stageTabServer.id).select = true;
    this.RaDesignStageComponent.showTools(this.factory.get(tools));
  }
}
