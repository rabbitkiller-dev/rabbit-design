import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {RaDesignDialogComponent} from './ra-design-dialog.component';
import {RaInputModule} from './input/ra-input.module';

@NgModule({
  imports: [CommonModule, FormsModule, RaInputModule],
  declarations: [RaDesignDialogComponent],
  exports: [RaDesignDialogComponent, RaInputModule]
})
export class RaDesignWidgetModule {
}
