import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NzFormatEmitEvent, NzTreeNodeOptions, TreeNodeModel} from '../../design-tree';

@Component({
  selector: 'ra-design-component-interface',
  templateUrl: './component.interface.html',
})
export class ComponentInterface implements OnInit {
  nzData: NzTreeNodeOptions[] = [];
  enterPredicate = () => false;

  constructor() {
  }

  ngOnInit() {
    this.nzData = [
      {
        key: 'forms',
        title: 'forms',
        // 'icon': 'fa-file',
        expanded: true,
        children: [
          {
            key: 'icon',
            title: 'icon',
            isLeaf: true,
            icon: 'rabbit-design:icon-iconfont'
          },
          {
            key: 'input',
            title: 'input',
            isLeaf: true,
            icon: 'rabbit-design:icon-input'
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
