import {NgModule} from '@angular/core';
import {RaDesignMenu} from './ra-design-menu';
import {RaDesignMenuItem} from './ra-design-menu-item';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [RaDesignMenu, RaDesignMenuItem],
  exports: [RaDesignMenu]
})
export class RaDesignMenuModule {
}
