import {ComponentFactory, ComponentFactoryResolver, Injectable, ViewContainerRef} from '@angular/core';
import {StageTabModel, StageTabServerModel} from './interface';
import {RaDesignStageComponent} from './ra-design-stage.component';
import {PageEditorInterface} from './page-editor/page-editor.interface';

export enum StageFactory {
  PageEditor = 'pageEditor',
}

@Injectable({
  providedIn: 'root'
})
export class RaDesignStageService {
  private toolsMap: Map<string, StageTabModel> = new Map();
  private toolsList: StageTabModel[] = [];
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
          icon: 'database'
        };
        this.toolsList.push(stage);
        this.toolsMap.set(stageTabServer.id, stage);
        break;
      default:
        throw new Error('NotStageFactory');
    }

    this.toolsMap.get(tools).select = true;
    this.RaDesignStageComponent.showTools(this.factory.get(tools));
  }
}
