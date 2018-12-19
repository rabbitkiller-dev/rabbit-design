import {ComponentFactory, ComponentFactoryResolver, Injectable, ViewContainerRef} from '@angular/core';
import {ToolsTabModel} from './interface';
import {RaDesignToolsComponent} from './ra-design-tools.component';
import {DataSourceInterface} from './data-source/data-source.interface';

export enum ToolsFactory {
  DataSource = 'dataSource',
}

@Injectable({
  providedIn: 'root'
})
export class RaDesignToolsService {
  private tools: ToolsTabModel[] = [];
  private factory: Map<String, ComponentFactory> = new Map();
  private RaDesignToolsComponent: RaDesignToolsComponent;
  left: ToolsTabModel[] = [];

  constructor(public ComponentFactoryResolver: ComponentFactoryResolver) {
  }

  init(RaDesignToolsComponent: RaDesignToolsComponent) {
    this.RaDesignToolsComponent = RaDesignToolsComponent;
    // 数据源管理
    this.tools.push({
      factory: ToolsFactory.DataSource,
      icon: 'fa-first-order',
      label: 'dataSource',
      position: 'left-top',
      order: 1,
      select: true,
    });
    this.factory.set(ToolsFactory.DataSource, this.ComponentFactoryResolver.resolveComponentFactory(DataSourceInterface));

    this.tools.forEach((tools) => {
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

    this.tools.forEach((tools) => {
      tools.select = false;
    });
    this.RaDesignToolsComponent.showTools(this.factory.get(tools));
  }
}
