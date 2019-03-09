import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'ra-design-component-interface',
  templateUrl: './component.interface.html',
  styleUrls: ['./component.interface.scss'],
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
