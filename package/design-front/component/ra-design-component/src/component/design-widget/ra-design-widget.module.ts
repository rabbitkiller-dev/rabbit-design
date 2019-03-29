import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {RaDesignDialogComponent} from './ra-design-dialog.component';
import {RaInputModule} from './input/ra-input.module';
import {RaDesignDragDropModule} from '../design-drag-drop';

@NgModule({
  imports: [CommonModule, FormsModule, RaDesignDragDropModule, RaInputModule],
  declarations: [RaDesignDialogComponent],
  exports: [RaDesignDialogComponent, RaInputModule]
})
export class RaDesignWidgetModule {
}
