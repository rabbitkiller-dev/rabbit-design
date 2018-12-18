import {AfterViewInit, Component, ComponentFactoryResolver, ElementRef, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {RaDesignToolsService} from './ra-design-tools.service';

@Component({
  selector: 'ra-design-tools',
  templateUrl: './ra-design-tools.component.html',
  styles: []
})
export class RaDesignToolsComponent implements AfterViewInit {
  @ViewChild('left', {read: ViewContainerRef}) left: ViewContainerRef;

  constructor(public ComponentFactoryResolver: ComponentFactoryResolver,
              public RaDesignToolsService: RaDesignToolsService) {
    this.RaDesignToolsService.init();
  }

  ngAfterViewInit() {
  }

  abc() {
    this.left.createComponent(this.RaDesignToolsService.factory.get('DataSource'));
  }
}
