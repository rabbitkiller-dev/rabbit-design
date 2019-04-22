import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';
import {InputPropertiesComponent} from './widget/input-properties.component';
import {IconPanelComponent} from './properties/icon-panel.component';
import {ButtonPanelComponent} from './properties/button-panel.component';
import {MenuPanelComponent} from './properties/menu-panel.component';
import {RaDesignTreeModule} from '../design-tree';

const Components = [
  InputPropertiesComponent,
  IconPanelComponent,
  ButtonPanelComponent,
  MenuPanelComponent,
]

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NgZorroAntdModule,
    RaDesignTreeModule,
  ],
  declarations: Components,
  exports: Components,
  providers: [],
  entryComponents: Components
})

export class RaDesignPropertiesModule {

}
