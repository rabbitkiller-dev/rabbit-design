import {Component, OnDestroy, OnInit} from '@angular/core';
import {RaDesignTreeComponent, RaDesignTreeService} from '../../design-tree';

@Component({
  templateUrl: './component.interface.html',
  providers: [
    RaDesignTreeService
  ]
})
export class ComponentInterface extends RaDesignTreeComponent implements OnInit{
  constructor(public RaDesignTreeService: RaDesignTreeService) {
    super(RaDesignTreeService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.nzData = [
      {
        'key': 1,
        'title': 'forms',
        // 'icon': 'fa-file',
        'children': [
          {
            'key': 2,
            'title': 'icon',
            // 'icon': 'fa-file'
          }
        ]
      },
    ];
  }
}
