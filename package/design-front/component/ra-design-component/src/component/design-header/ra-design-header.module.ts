import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NzIconModule} from 'ng-zorro-antd';
import {RaDesignHeaderService} from './ra-design-header.service';
import {RaDesignHeaderComponent} from './ra-design-header.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    NzIconModule,
    TranslateModule.forChild(),
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
