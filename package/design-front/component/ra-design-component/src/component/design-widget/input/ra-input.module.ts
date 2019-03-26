import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzAddOnModule } from '../core/addon/addon.module';

import { PlatformModule } from '@angular/cdk/platform';
import { RaInputDirective } from './ra-input.directive';

@NgModule({
  declarations: [ RaInputDirective],
  exports     : [ RaInputDirective],
  imports     : [ CommonModule, FormsModule, PlatformModule, NzAddOnModule ]
})
export class RaInputModule {
}
