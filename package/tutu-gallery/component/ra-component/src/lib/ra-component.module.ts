import {ModuleWithProviders, NgModule} from '@angular/core';
import {RaComponentComponent} from './ra-component.component';

import {RaIconModule} from './icon/ra-icon.module';

export * from './icon';

@NgModule({
  declarations: [RaComponentComponent],
  imports: [],
  exports: [RaComponentComponent, RaIconModule]
})
export class RaComponentModule {
  /**
   * @deprecated Use `NgZorroAntdModule` instead.
   */
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RaComponentModule
    };
  }
}
