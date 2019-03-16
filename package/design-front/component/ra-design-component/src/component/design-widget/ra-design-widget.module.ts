import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RaDesignDialogComponent} from './ra-design-dialog.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [RaDesignDialogComponent],
  exports: [RaDesignDialogComponent]
})
export class RaDesignWidgetModule {
}
