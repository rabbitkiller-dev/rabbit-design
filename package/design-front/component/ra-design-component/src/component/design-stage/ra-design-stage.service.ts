import {
  ComponentFactory,
  ComponentFactoryResolver,
  Injectable,
} from '@angular/core';
import {StageServiceEvent, StageTabModel, StageTabServerModel} from './interface';
import {PageEditorInterface} from './page-editor/page-editor.interface';
import {moveItemInArray} from '../cdk-drag-drop';
import {LocalStorageService} from 'ngx-webstorage';
import {Subject} from 'rxjs';

export enum StageFactory {
  PageEditor = 'pageEditor',
}

@Injectable()
export class RaDesignStageService extends Subject<StageServiceEvent> {
  /**
   * static
   */
  stageList: StageTabModel[] = [];
  private stageMap: Map<string, StageTabModel> = new Map();
  private factory: Map<String, ComponentFactory<any>> = new Map();

  constructor(
    public ComponentFactoryResolver: ComponentFactoryResolver,
    public LocalStorageService: LocalStorageService,
  ) {
    super();
    this.init();
  }

  init() {
    this.factory.set(StageFactory.PageEditor, this.ComponentFactoryResolver.resolveComponentFactory(PageEditorInterface));
    this.stageList = this.getLocalModel() || [];
    this.stageList.forEach((stage) => {
      this.stageMap.set(stage.id, stage);
    });
  }

  putStage(tools: StageFactory, stageTabServer: StageTabServerModel) {
    if (this.stageMap.get(stageTabServer.id)) {
      this.showStage(stageTabServer.id);
      return;
    }

    switch (tools) {
      case StageFactory.PageEditor:
        const stage = {
          factory: StageFactory.PageEditor,
          icon: 'rabbit-design:icon-page',
          ...stageTabServer,
        };
        this.stageList.push(stage);
        this.stageMap.set(stageTabServer.id, stage);
        break;
      default:
        throw new Error('NotStageFactory');
    }
    this.stageList.forEach(stage => stage.select = false);
    this.stageMap.get(stageTabServer.id).select = true;
    this.next({type: 'open', data: this.stageMap.get(stageTabServer.id)});
    this.saveLocalModel();
  }

  deleteStage(stageID: string) {
    const stageTab = this.stageMap.get(stageID);
    this.stageMap.delete(stageID);
    this.stageList.splice(this.stageList.indexOf(stageTab), 1);
    this.saveLocalModel();
  }

  showStage(stageID: string) {
    const stage = this.stageMap.get(stageID);
    if (stage.select) {
      return;
    }
    this.stageList.forEach(stage => stage.select = false);
    stage.select = true;
    this.next({type: 'open', data: stage});
    this.saveLocalModel();
  }

  getFactory(tools: StageFactory) {
    return this.factory.get(tools);
  }

  moveItemInArray(fromIndex: number, toIndex: number): void {
    moveItemInArray(this.stageList, fromIndex, toIndex);
    this.saveLocalModel();
  }

  saveLocalModel() {
    this.LocalStorageService.store('stage-tab-local', this.stageList);
  }

  getLocalModel(): StageTabModel[] {
    return this.LocalStorageService.retrieve('stage-tab-local');
  }

  map(call: (stage: StageTabModel) => void): void {
    this.stageList.map(call);
  }
}
