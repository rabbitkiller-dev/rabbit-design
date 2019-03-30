import {Injector} from '@angular/core';
import {ToolsFactory} from './ra-design-tools.service';
import {RUNTIME_EVENT_ENUM, RuntimeEventService} from '../design-runtime/runtime-event.service';
import {RaHiddenInterface, RaShowInterface} from './interface';

export class RaDesignToolsInterface implements RaShowInterface, RaHiddenInterface {
  RuntimeEventService: RuntimeEventService;
  factory: ToolsFactory;

  minimize() {
    this.RuntimeEventService.emit(RUNTIME_EVENT_ENUM.ToolsInterface_Minimize, this.factory);
  }

  constructor(public Inject: Injector) {
    this.RuntimeEventService = this.Inject.get(RuntimeEventService);
  }

  raHiddenInterface() {
  }

  raShowInterface() {
  }
}

