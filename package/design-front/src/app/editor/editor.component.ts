import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';

@Component({
  selector: 'design-editor',
  templateUrl: './editor.component.html',
  changeDetection    : ChangeDetectionStrategy.OnPush,
})
export class EditorComponent implements AfterViewInit {
  constructor(private cdr: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
  }

}
