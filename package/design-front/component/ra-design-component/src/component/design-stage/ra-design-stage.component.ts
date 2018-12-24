import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {RaDesignStageService} from './ra-design-stage.service';


@Component({
  selector: 'ra-design-stage',
  template: `
    <!-- stage的上方上任务栏 -->
    <div class="stage-taskbar" cdkDropList cdkDropListOrientation="horizontal" (cdkDropListDropped)="drop($event)">
      <ng-container *ngFor="let tools of RaDesignStageService.stageList">
        <!-- TODO cdkDragBoundary=".stage-taskbar" 限制移动元素 -->
        <li class="stage-taskbar-item" [class.is-select]="tools.select"
            [style.order]="tools.order" cdkDrag>
          <i nz-icon [type]="tools.icon" theme="outline"></i>
          <span>{{tools.title}}</span>
          <i nz-icon type="close" theme="outline"></i>
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
  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    moveItemInArray(this.RaDesignStageService.stageList, event.previousIndex, event.currentIndex);
  }
}
