import {ComponentFactory, ComponentFactoryResolver, Injectable, ViewContainerRef} from '@angular/core';
import {ToolsTabModel} from './interface';
import {RaDesignToolsComponent} from './ra-design-tools.component';
import {DataSourceInterface} from './data-source/data-source.interface';
import {ComponentInterface} from './component/component.interface';

export enum ToolsFactory {
  DataSource = 'dataSource',
  Component = 'component',
}

@Injectable({
  providedIn: 'root'
})
export class RaDesignToolsService {
  private toolsMap: Map<ToolsFactory, ToolsTabModel> = new Map();
  private toolsList: ToolsTabModel[] = [];
  private factory: Map<String, ComponentFactory<any>> = new Map();
  private RaDesignToolsComponent: RaDesignToolsComponent;
  left: ToolsTabModel[] = [];

  constructor(public ComponentFactoryResolver: ComponentFactoryResolver) {
  }

  init(RaDesignToolsComponent: RaDesignToolsComponent) {
    this.RaDesignToolsComponent = RaDesignToolsComponent;
    // 数据源管理
    this.toolsList.push({
      factory: ToolsFactory.DataSource,
      icon: 'database',
      label: 'dataSource',
      position: 'left-top',
      order: 1,
      select: true,
    });
    this.factory.set(ToolsFactory.DataSource, this.ComponentFactoryResolver.resolveComponentFactory(DataSourceInterface));
    // 组件列表
    this.toolsList.push({
      factory: ToolsFactory.Component,
      icon: 'database',
      label: 'dataSource',
      position: 'left-top',
      order: 2,
      select: false,
    });
    this.factory.set(ToolsFactory.Component, this.ComponentFactoryResolver.resolveComponentFactory(ComponentInterface));

    this.toolsList.forEach((tools) => {
      this.toolsMap.set(tools.factory, tools);

      switch (tools.position) {
        case 'left-top':
          this.left.push(tools);
          break;
        case 'left-bottom':
          tools.order += 100;
          this.left.push(tools);
          break;
        default:
          throw new Error('NotPosition');
      }
    });
  }

  showTools(tools: ToolsFactory) {
    this.toolsList.forEach((tools) => {
      tools.select = false;
    });
    this.toolsMap.get(tools).select = true;
    this.RaDesignToolsComponent.showTools(this.factory.get(tools));
  }
}
