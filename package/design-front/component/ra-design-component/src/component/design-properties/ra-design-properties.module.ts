import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NzFormModule, NzIconModule} from 'ng-zorro-antd';
import {InputPropertiesComponent} from './widget/input-properties.component';
import {FormsModule} from '@angular/forms';
import {RaDesignWidgetModule} from '../design-widget/ra-design-widget.module';
import {IconPanelComponent} from './properties/icon-panel.component';

const Components = [
  InputPropertiesComponent,
  IconPanelComponent,
]

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NzIconModule,
    NzFormModule,
    RaDesignWidgetModule,
  ],
  declarations: Components,
  exports: Components,
  providers: [],
  entryComponents: Components
})

export class RaDesignPropertiesModule {

}
