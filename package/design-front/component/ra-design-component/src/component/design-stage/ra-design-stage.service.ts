import {ComponentFactory, ComponentFactoryResolver, Injectable} from '@angular/core';
import {StageTabModel, StageTabServerModel} from './interface';
import {PageEditorInterface} from './page-editor/page-editor.interface';
import {moveItemInArray} from '../cdk-drag-drop';
import {LocalStorageService} from 'ngx-webstorage';
import {RUNTIME_EVENT_ENUM, RuntimeEventService} from '../design-runtime/runtime-event.service';

export enum StageFactoryType {
  PageEditor = 'pageEditor',
}

@Injectable()
export class RaDesignStageService {
  /**
   * static
   */
  readonly stageList: StageTabModel[] = [];
  readonly stageMap: Map<string, StageTabModel> = new Map();
  private factory: Map<String, ComponentFactory<any>> = new Map();

  constructor(
    public ComponentFactoryResolver: ComponentFactoryResolver,
    public RuntimeEventService: RuntimeEventService,
    public LocalStorageService: LocalStorageService,
  ) {
    this.init();
  }

  init() {
    this.factory.set(StageFactoryType.PageEditor, this.ComponentFactoryResolver.resolveComponentFactory(PageEditorInterface));
    this.stageList.push(...this.getLocalModel());
    this.stageList.forEach((stage) => {
      this.stageMap.set(stage.id, stage);
    });
  }

  putStage(tools: StageFactoryType, stageTabServer: StageTabServerModel) {
    if (this.stageMap.get(stageTabServer.id)) {
      this.showStage(stageTabServer.id);
      return;
    }

    switch (tools) {
      case StageFactoryType.PageEditor:
        const stage = {
          factory: StageFactoryType.PageEditor,
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
    this.RuntimeEventService.emit(RUNTIME_EVENT_ENUM.Stage_Put, this.stageMap.get(stageTabServer.id));
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
    this.saveLocalModel();
  }

  getFactory(tools: StageFactoryType) {
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
    const tabs = this.LocalStorageService.retrieve('stage-tab-local');
    return tabs || [];
  }

  map(call: (stage: StageTabModel) => void): void {
    this.stageList.map(call);
  }
}
