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
import {ToolsTabModel} from './interface';

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
  componentRefMap: Map<ToolsFactory, ViewRef> = new Map();

  constructor(public ViewContainerRef: ViewContainerRef,
              public NzIconService: NzIconService,
              public RaDesignToolsService: RaDesignToolsService) {
    this.RaDesignToolsService.subscribe((event) => {
      if (event.type) {
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
      const componentRef = this.ViewContainerRef.createComponent(factory);
      this.componentRefMap.set(factoryName, this.ViewContainerRef.detach(0));
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
              this.leftTop.detach(0);
              this.leftTop.insert(this.componentRefMap.get(sideBar.factory));
            }
            leftTopToolsTabModel = this.leftTopToolsTabModel;
            break;
          case 'left-bottom':
            if (this.leftBottomToolsTabModel !== sideBar) {
              this.leftBottomToolsTabModel = sideBar;
              this.leftBottom.detach(0);
              this.leftBottom.insert(this.componentRefMap.get(sideBar.factory));
            }
            leftBottomToolsTabModel = this.leftBottomToolsTabModel;
            break;
          case 'right-top':
            if (this.rightTopToolsTabModel !== sideBar) {
              rightTopToolsTabModel = this.rightTopToolsTabModel = sideBar;
              this.rightTop.detach(0);
              this.rightTop.insert(this.componentRefMap.get(sideBar.factory));
            }
            break;
          case 'right-bottom':
            if (this.rightBottomToolsTabModel !== sideBar) {
              rightBottomToolsTabModel = this.rightBottomToolsTabModel = sideBar;
              this.rightBottom.detach(0);
              this.rightBottom.insert(this.componentRefMap.get(sideBar.factory));
            }
            break;
        }
      }
    });
    if (!leftTopToolsTabModel) {
      this.leftTopToolsTabModel = null;
      this.leftTop.detach(0);
    }
    if (!leftBottomToolsTabModel) {
      this.leftBottomToolsTabModel = null;
      this.leftBottom.detach(0);
    }
    if (!rightTopToolsTabModel) {
      this.rightTopToolsTabModel = null;
      this.rightTop.detach(0);
    }
    if (!rightBottomToolsTabModel) {
      this.rightBottomToolsTabModel = null;
      this.rightBottom.detach(0);
    }
  }
}
