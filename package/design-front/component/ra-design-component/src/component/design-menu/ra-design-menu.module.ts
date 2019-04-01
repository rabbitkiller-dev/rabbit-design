import {NgModule} from '@angular/core';
import {RaDesignMenu} from './ra-design-menu';
import {RaDesignMenuItem} from './ra-design-menu-item';
import {CommonModule} from '@angular/common';
import {NzIconModule} from 'ng-zorro-antd';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [CommonModule, NzIconModule, TranslateModule.forChild()],
  declarations: [RaDesignMenu, RaDesignMenuItem],
  exports: [RaDesignMenu]
})
export class RaDesignMenuModule {
}
