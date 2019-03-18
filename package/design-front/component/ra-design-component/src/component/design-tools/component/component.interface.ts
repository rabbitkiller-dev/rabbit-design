import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NzFormatEmitEvent} from '../../design-tree';

@Component({
  selector: 'ra-design-component-interface',
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
            'isLeaf': true,
            // 'icon': 'fa-file'
          },
          {
            'key': 'input',
            'title': 'input',
            'isLeaf': true,
          }
        ]
      },
    ];
  }

  ondbClick($event: NzFormatEmitEvent) {
    if ($event.node.children && $event.node.children.length > 0) {
      $event.node.setExpanded(!$event.node.isExpanded);
    }
  }
}
