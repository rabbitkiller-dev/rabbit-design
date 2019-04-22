import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';
import {IconPanelComponent} from './properties/icon-panel.component';
import {ButtonPanelComponent} from './properties/button-panel.component';
import {InputPropertiesComponent} from './widget/input-properties.component';

const Components = [
  InputPropertiesComponent,
  IconPanelComponent,
  ButtonPanelComponent,
]

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NgZorroAntdModule,
  ],
  declarations: Components,
  exports: Components,
  providers: [],
  entryComponents: Components
})

export class RaDesignPropertiesModule {

}
