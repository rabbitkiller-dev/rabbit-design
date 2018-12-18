import {ComponentFactory, ComponentFactoryResolver, Injectable} from '@angular/core';
import {DataSourceInterface} from './data-source/data-source.interface';

@Injectable({
  providedIn: 'root'
})
export class RaDesignToolsService {
  factory: Map<String, ComponentFactory<DataSourceInterface>> = new Map();

  constructor(public ComponentFactoryResolver: ComponentFactoryResolver) {
  }

  init() {
    this.factory.set('DataSource', this.ComponentFactoryResolver.resolveComponentFactory(DataSourceInterface));
  }
}
