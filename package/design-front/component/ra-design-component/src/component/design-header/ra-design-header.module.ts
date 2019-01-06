import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NzIconModule} from 'ng-zorro-antd';
import {RaDesignHeaderService} from './ra-design-header.service';
import {RaDesignHeaderComponent} from './ra-design-header.component';

@NgModule({
  imports: [
    CommonModule,
    NzIconModule,
  ],
  declarations: [
    RaDesignHeaderComponent,
  ],
  exports: [
    RaDesignHeaderComponent,
  ],
  providers: [
    RaDesignHeaderService
  ],
  entryComponents: [
  ]
})

export class RaDesignHeaderModule {

}
