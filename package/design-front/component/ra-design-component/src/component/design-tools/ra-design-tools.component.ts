import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef, OnInit,
  ViewChild,
  ViewContainerRef, ViewRef
} from '@angular/core';
import {RaDesignToolsService, ToolsFactory} from './ra-design-tools.service';
import {NzIconService} from 'ng-zorro-antd';
import {RaHiddenInterface, RaShowInterface, ToolsTabModel} from './interface';
import {RaDesignToolsInterface} from 'ra-design-component';

@Component({
  selector: 'ra-design-tools',
  templateUrl: './ra-design-tools.component.html',
  styles: []
})
export class RaDesignToolsComponent implements OnInit, AfterViewInit {
  @ViewChild('leftTop', {read: ViewContainerRef}) leftTop: ViewContainerRef;
  @ViewChild('leftBottom', {read: ViewContainerRef}) leftBottom: ViewContainerRef;
  @ViewChild('rightTop', {read: ViewContainerRef}) rightTop: ViewContainerRef;
  @ViewChild('rightBottom', {read: ViewContainerRef}) rightBottom: ViewContainerRef;
  rightTopToolsTabModel: ToolsTabModel;
  leftBottomToolsTabModel: ToolsTabModel;
  rightBottomToolsTabModel: ToolsTabModel;
  leftTopToolsTabModel: ToolsTabModel;
  viewRefMap: Map<ToolsFactory, ViewRef> = new Map();
  componentRefMap: Map<ToolsFactory, ComponentRef<RaDesignToolsInterface>> = new Map();

  constructor(public ViewContainerRef: ViewContainerRef,
              public NzIconService: NzIconService,
              public RaDesignToolsService: RaDesignToolsService) {
    this.RaDesignToolsService.subscribe((event) => {
      if (event.type === 'review') {
        this.reviewInterface();
      }
    });
    this.NzIconService.changeAssetsSource('api/icons/');
  }

  ngOnInit() {
    this.initViewInterface();
    this.reviewInterface();
  }

  ngAfterViewInit() {
  }

  onClickTools(tools: ToolsTabModel) {
    this.RaDesignToolsService.showTools(tools);
  }

  initViewInterface() {
    for (const key of Object.keys(ToolsFactory)) {
      const factoryName: ToolsFactory = ToolsFactory[key];
      const factory = this.RaDesignToolsService.getFactory(factoryName);
      const componentRef: ComponentRef<RaDesignToolsInterface> = this.ViewContainerRef.createComponent(factory);
      componentRef.instance.factory = factoryName;
      this.componentRefMap.set(factoryName, componentRef);
      this.viewRefMap.set(factoryName, this.ViewContainerRef.detach(0));
    }
  }

  reviewInterface() {
    let leftTopToolsTabModel: ToolsTabModel = null;
    let leftBottomToolsTabModel: ToolsTabModel = null;
    let rightTopToolsTabModel = null;
    let rightBottomToolsTabModel = null;
    this.RaDesignToolsService.map((sideBar) => {
      if (sideBar.select) {
        switch (sideBar.position) {
          case 'left-top':
            if (this.leftTopToolsTabModel !== sideBar) {
              this.leftTopToolsTabModel = sideBar;
              if (this.leftTop.detach(0) && this.componentRefMap.get(this.leftTopToolsTabModel.factory).instance.raHiddenInterface) {
                this.componentRefMap.get(this.leftTopToolsTabModel.factory).instance.raHiddenInterface();
              }
              this.leftTop.insert(this.viewRefMap.get(sideBar.factory));
              if (this.componentRefMap.get(sideBar.factory).instance.raShowInterface) {
                this.componentRefMap.get(sideBar.factory).instance.raShowInterface();
              }
            }
            leftTopToolsTabModel = this.leftTopToolsTabModel;
            break;
          case 'left-bottom':
            if (this.leftBottomToolsTabModel !== sideBar) {
              this.leftBottomToolsTabModel = sideBar;
              this.leftBottom.detach(0);
              if (this.leftBottom.detach(0) && this.componentRefMap.get(this.leftBottomToolsTabModel.factory).instance.raHiddenInterface) {
                this.componentRefMap.get(this.leftBottomToolsTabModel.factory).instance.raHiddenInterface();
              }
              this.leftBottom.insert(this.viewRefMap.get(sideBar.factory));
              if (this.componentRefMap.get(sideBar.factory).instance.raShowInterface) {
                this.componentRefMap.get(sideBar.factory).instance.raShowInterface();
              }
            }
            leftBottomToolsTabModel = this.leftBottomToolsTabModel;
            break;
          case 'right-top':
            if (this.rightTopToolsTabModel !== sideBar) {
              this.rightTopToolsTabModel = sideBar;
              if (this.rightTop.detach(0) && this.componentRefMap.get(this.rightTopToolsTabModel.factory).instance.raHiddenInterface) {
                this.componentRefMap.get(this.rightTopToolsTabModel.factory).instance.raHiddenInterface();
              }
              this.rightTop.insert(this.viewRefMap.get(sideBar.factory));
              if (this.componentRefMap.get(sideBar.factory).instance.raShowInterface) {
                this.componentRefMap.get(sideBar.factory).instance.raShowInterface();
              }
            }
            rightTopToolsTabModel = this.rightTopToolsTabModel;
            break;
          case 'right-bottom':
            if (this.rightBottomToolsTabModel !== sideBar) {
              this.rightBottomToolsTabModel = sideBar;
              if (this.rightBottom.detach(0) && this.componentRefMap.get(this.rightBottomToolsTabModel.factory).instance.raHiddenInterface) {
                this.componentRefMap.get(this.rightBottomToolsTabModel.factory).instance.raHiddenInterface();
              }
              this.rightBottom.insert(this.viewRefMap.get(sideBar.factory));
              if (this.componentRefMap.get(sideBar.factory).instance.raShowInterface) {
                this.componentRefMap.get(sideBar.factory).instance.raShowInterface();
              }
            }
            rightBottomToolsTabModel = this.rightBottomToolsTabModel;
            break;
        }
      }
    });
    if (!leftTopToolsTabModel && this.leftTopToolsTabModel) {
      if (this.componentRefMap.get(this.leftTopToolsTabModel.factory).instance.raHiddenInterface) {
        this.componentRefMap.get(this.leftTopToolsTabModel.factory).instance.raHiddenInterface();
      }
      this.leftTopToolsTabModel = null;
      this.leftTop.detach(0);
    }
    if (!leftBottomToolsTabModel && this.leftBottomToolsTabModel) {
      if (this.componentRefMap.get(this.leftBottomToolsTabModel.factory).instance.raHiddenInterface) {
        this.componentRefMap.get(this.leftBottomToolsTabModel.factory).instance.raHiddenInterface();
      }
      this.leftBottomToolsTabModel = null;
      this.leftBottom.detach(0);
    }
    if (!rightTopToolsTabModel && this.rightTopToolsTabModel) {
      if (this.componentRefMap.get(this.rightTopToolsTabModel.factory).instance.raHiddenInterface) {
        this.componentRefMap.get(this.rightTopToolsTabModel.factory).instance.raHiddenInterface();
      }
      this.rightTopToolsTabModel = null;
      this.rightTop.detach(0);
    }
    if (!rightBottomToolsTabModel && this.rightBottomToolsTabModel) {
      if (this.componentRefMap.get(this.rightBottomToolsTabModel.factory).instance.raHiddenInterface) {
        this.componentRefMap.get(this.rightBottomToolsTabModel.factory).instance.raHiddenInterface();
      }
      this.rightBottomToolsTabModel = null;
      this.rightBottom.detach(0);
    }
  }
}
