import {
  AfterViewInit,
  Component,
  ComponentFactory,
  ComponentFactoryResolver, ComponentRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {RaDesignToolsService} from './ra-design-tools.service';

@Component({
  selector: 'ra-design-tools',
  templateUrl: './ra-design-tools.component.html',
  styles: []
})
export class RaDesignToolsComponent implements AfterViewInit {
  // private componentRefList: Map<>;
  @ViewChild('left', {read: ViewContainerRef}) left: ViewContainerRef;

  constructor(public ComponentFactoryResolver: ComponentFactoryResolver,
              public RaDesignToolsService: RaDesignToolsService) {
    this.RaDesignToolsService.init(this);
  }

  ngAfterViewInit() {
  }

  showTools(componentFactory: ComponentFactory<any>) {
    // this.componentRefList.push()
    this.left.clear();
    this.left.createComponent(componentFactory);
  }
}
