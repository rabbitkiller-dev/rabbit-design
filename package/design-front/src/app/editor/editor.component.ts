import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';

@Component({
  selector: 'design-editor',
  templateUrl: './editor.component.html',
  changeDetection    : ChangeDetectionStrategy.OnPush,
})
export class EditorComponent implements AfterViewInit {
  data: any[] = [
    {
      'key': 1,
      'title': 'New',
      // 'icon': 'fa-file',
      'children': [
        {
          'key': 2,
          'title': 'File',
          // 'icon': 'fa-file'
          'children': [
            {
              'key': 2,
              'title': 'File',
              // 'icon': 'fa-file'
            }
          ]
        }
      ]
    },
    {
      'key': 3,
      'title': 'Copy',
      // 'icon': 'fa-file',
      'shortcut': 'ctrl+c'
    },
    {
      'key': 4,
      'title': 'Cut',
      // 'icon': 'fa-file',
      'shortcut': 'ctrl+x',
      'children': [
      ]
    }
  ];
  constructor(private cdr: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
  }

}
