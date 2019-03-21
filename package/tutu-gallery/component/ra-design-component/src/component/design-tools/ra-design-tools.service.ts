import {ComponentFactory, ComponentFactoryResolver, Injectable, ViewContainerRef} from '@angular/core';
import {ToolsTabModel} from './interface';
import {RaDesignToolsComponent} from './ra-design-tools.component';
import {ImagesInterface} from './images/images.interface';
import {LineInterface} from './line/line.interface';

export enum ToolsFactory {
  images = 'images',
  line = 'line',
}

@Injectable()
export class RaDesignToolsService {
  private toolsMap: Map<ToolsFactory, ToolsTabModel> = new Map();
  private toolsList: ToolsTabModel[] = [];
  private factory: Map<String, ComponentFactory<any>> = new Map();
  private RaDesignToolsComponent: RaDesignToolsComponent;
  left: ToolsTabModel[] = [];
  right: ToolsTabModel[] = [];

  constructor(public ComponentFactoryResolver: ComponentFactoryResolver) {
  }

  init(RaDesignToolsComponent: RaDesignToolsComponent) {
    this.RaDesignToolsComponent = RaDesignToolsComponent;
    // 数据源管理
    this.toolsList.push({
      factory: ToolsFactory.images,
      label: '图片列表',
      position: 'left-top',
      order: 1,
      select: true,
      icon: ''
    });
    this.factory.set(ToolsFactory.images, this.ComponentFactoryResolver.resolveComponentFactory(ImagesInterface));
    // 数据源管理
    this.toolsList.push({
      factory: ToolsFactory.line,
      label: '画框线条',
      position: 'left-top',
      order: 2,
      select: false,
      icon: ''
    });
    this.factory.set(ToolsFactory.line, this.ComponentFactoryResolver.resolveComponentFactory(LineInterface));
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
    setTimeout(() => {
      this.showTools(this.toolsList.find(tools => tools.select));
    });
  }

  showTools(tools: ToolsTabModel) {
    this.toolsList.forEach((tools) => {
      tools.select = false;
    });
    this.toolsMap.get(tools.factory).select = true;
    this.RaDesignToolsComponent.showTools(this.factory.get(tools.factory));
  }
}
