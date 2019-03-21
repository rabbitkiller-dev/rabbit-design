import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SelectProjectComponent} from './select-project.component';
import {SelectProjectService} from './select-project.service';

@NgModule({
  declarations: [
    SelectProjectComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: SelectProjectComponent
      },
    ]),
  ],
  providers: [SelectProjectService],
})
export class SelectProjectModule {
}
