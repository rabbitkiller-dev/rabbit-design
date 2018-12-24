import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {RaDesignStageService} from './ra-design-stage.service';


@Component({
  selector: 'ra-design-stage',
  template: `
    <div class="editor-stage-taskbar">
      <ng-container *ngFor="let tools of RaDesignStageService.stageList">
        <li class="editor-tools-item" [class.is-select]="tools.select" (click)="clickStageTools(tools)"
            [style.order]="tools.order">
          <i class="fa {{tools.icon}}"></i>
          <span>{{tools.title}}</span>
          <i class="fa fa-close" (click)="closeStageTools(tools)"></i>
        </li>
      </ng-container>
    </div>
    <div class="editor-stage-main">
      <ng-template #main></ng-template>
      <!--<ra-design-stage-interface></ra-design-stage-interface>-->
    </div>
  `,
  styles: []
})
export class RaDesignStageComponent implements OnInit {

  @ViewChild('main', {read: ViewContainerRef}) main: ViewContainerRef;

  constructor(public RaDesignStageService: RaDesignStageService) {
    this.RaDesignStageService.init(this);
  }

  ngOnInit() {
  }

  showTools(componentFactory) {
    this.main.clear();
    this.main.createComponent(componentFactory);
  }
}
