import {ComponentFactory, ComponentFactoryResolver, Injectable} from '@angular/core';
import {SideBarServiceEvent, StoreSideBarLocalModel, ToolsTabModel} from './interface';
import {DataSourceInterface} from './data-source/data-source.interface';
import {ComponentInterface} from './component/component.interface';
import {PageInterface} from './page/page.interface';
import {IconInterface} from './icon/icon.interface';
import {PropertiesEditorInterface} from './properties-editor/properties-editor.interface';
import {LocalStorageService} from 'ngx-webstorage';
import {Subject} from 'rxjs';
import {StructureInterface} from './structure/structure.interface';
export enum ToolsFactory {
  DataSource = 'dataSource',
  Page = 'page',
  Component = 'component',
  Icon = 'icon',
  Structure = 'structure',
  propertiesEditor = 'propertiesEditor',
}

@Injectable()
export class RaDesignToolsService extends Subject<SideBarServiceEvent> {
  private toolsMap: Map<ToolsFactory, ToolsTabModel> = new Map();
  private toolsList: ToolsTabModel[] = [];
  private factory: Map<String, ComponentFactory<any>> = new Map();
  left: ToolsTabModel[] = [];
  right: ToolsTabModel[] = [];

  constructor(public ComponentFactoryResolver: ComponentFactoryResolver, public LocalStorageService: LocalStorageService) {
    super();
    this.init();
  }

  private init() {
    // 数据源管理
    this.toolsList.push({
      factory: ToolsFactory.DataSource,
      label: 'dataSource',
      position: 'left-top',
      icon: 'rabbit-design:icon-database'
    });
    this.factory.set(ToolsFactory.DataSource, this.ComponentFactoryResolver.resolveComponentFactory(DataSourceInterface));
    // 页面列表
    this.toolsList.push({
      factory: ToolsFactory.Page,
      label: '页面管理',
      position: 'left-top',
      select: true,
      icon: 'rabbit-design:icon-page'
    });
    this.factory.set(ToolsFactory.Page, this.ComponentFactoryResolver.resolveComponentFactory(PageInterface));
    // 组件列表
    this.toolsList.push({
      factory: ToolsFactory.Component,
      label: 'component',
      position: 'left-top',
      select: false,
      icon: 'rabbit-design:icon-component'
    });
    this.factory.set(ToolsFactory.Component, this.ComponentFactoryResolver.resolveComponentFactory(ComponentInterface));
    // 结构
    this.toolsList.push({
      factory: ToolsFactory.Structure,
      label: 'structure',
      position: 'left-bottom',
      select: false,
      icon: 'rabbit-design:icon-structure',
    });
    this.factory.set(ToolsFactory.Structure, this.ComponentFactoryResolver.resolveComponentFactory(StructureInterface));
    // 图标
    this.toolsList.push({
      factory: ToolsFactory.Icon,
      label: 'icons',
      position: 'left-bottom',
      select: false,
      icon: 'rabbit-design:icon-iconfont',
    });
    this.factory.set(ToolsFactory.Icon, this.ComponentFactoryResolver.resolveComponentFactory(IconInterface));
    // 属性面板
    this.toolsList.push({
      factory: ToolsFactory.propertiesEditor,
      label: 'properties',
      position: 'right-top',
      select: false,
      icon: 'rabbit-design:icon-properties',
    });
    this.factory.set(ToolsFactory.propertiesEditor, this.ComponentFactoryResolver.resolveComponentFactory(PropertiesEditorInterface));
    // 先初始化toolsMap优化查询
    this.toolsList.forEach((tools) => {
      this.toolsMap.set(tools.factory, tools);
    });
    // 和本地数据合并
    const localModel = this.getLocalModel();
    if (localModel) {
      for (const key of Object.keys(ToolsFactory)) {
        const factory = ToolsFactory[key];
        Object.assign(this.toolsMap.get(factory), localModel[factory]);
      }
    }
    // 排序tools
    this.sort();
    // 重算order
    const indexs = {};
    this.toolsList.forEach((tools) => {
      const index = indexs[tools.position] || 0;
      indexs[tools.position] = tools.order = index + 1;
      switch (tools.position) {
        case 'left-top':
          this.left.push(tools);
          break;
        case 'left-bottom':
          tools.order += 100;
          this.left.push(tools);
          break;
        case 'right-top':
          this.right.push(tools);
          break;
        case 'right-bottom':
          tools.order += 100;
          this.right.push(tools);
          break;
        default:
          throw new Error('NotPosition');
      }
    });
    // 保存本地数据
    this.saveLocalModel();
  }

  showTools(tools: ToolsFactory);
  showTools(tools: ToolsTabModel);
  showTools(tools: any) {
    if (typeof tools === 'string') {
      tools = this.toolsMap.get(tools as any);
    }
    // 获取相同位置的工具栏
    this.toolsList.forEach((_tools) => {
      if (_tools.position === tools.position && _tools !== tools) {
        _tools.select = false;
      }
    });
    tools.select = !tools.select;
    this.next({type: 'review'});
    this.saveLocalModel();
  }

  getFactory(tools: ToolsFactory) {
    return this.factory.get(tools);
  }

  map(call: (tools: ToolsTabModel) => void): void {
    this.toolsList.map(call);
  }

  saveLocalModel() {
    const store: StoreSideBarLocalModel = {} as any;
    this.toolsList.forEach((sideBar) => {
      store[sideBar.factory] = {
        position: sideBar.position,
        order: sideBar.order,
        select: sideBar.select,
        minHeight: sideBar.minHeight,
      };
    });
    this.LocalStorageService.store('side-bar-local', store);
  }

  getLocalModel(): StoreSideBarLocalModel {
    return this.LocalStorageService.retrieve('side-bar-local');
  }

  // 排序
  sort() {
    this.toolsList.sort((tools1, tools2) => {
      if (tools1.position === tools2.position) {
        return tools1.order - tools2.order;
      }
      if (tools1.position === 'left-top') {
        return -1;
      }
      if (tools1.position === 'left-bottom') {
        return tools2.position === 'left-top' ? 1 : -1;
      }
      if (tools1.position === 'right-top') {
        return (tools2.position === 'left-top' || tools2.position === 'left-bottom') ? 1 : -1;
      }
      if (tools1.position === 'right-bottom') {
        return (tools2.position === 'left-top' || tools2.position === 'left-bottom' || tools2.position === 'right-top') ? 1 : -1;
      }
    });
  }
}
