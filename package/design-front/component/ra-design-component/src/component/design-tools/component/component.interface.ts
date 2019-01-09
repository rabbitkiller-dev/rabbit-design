import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  templateUrl: './component.interface.html',
})
export class ComponentInterface implements OnInit {
  nzData = [];
  enterPredicate = () => false;

  constructor() {
  }

  ngOnInit() {
    this.nzData = [
      {
        'key': 'forms',
        'title': 'forms',
        // 'icon': 'fa-file',
        'children': [
          {
            'key': 'icon',
            'title': 'icon',
            'leaf': false,
            // 'icon': 'fa-file'
          },
          {
            'key': 'input',
            'title': 'input',
            'leaf': true,
          }
        ]
      },
    ];
  }
}
