import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '../cdk-drag-drop';
import {RaDesignStageService} from './ra-design-stage.service';
import {RaDesignDragDirective, RaDesignDropDirective, DesignDragDrop} from '../design-drag-drop';
import {StageTabModel} from './interface';


@Component({
  selector: 'ra-design-stage',
  template: `
    <!-- stage的上方上任务栏 -->
    <div class="stage-bar" designDrop (onDesignDropped)="onDesignDropped($event)">
      <ng-container *ngFor="let tools of RaDesignStageService.stageList">
        <!-- TODO cdkDragBoundary=".stage-bar" 限制移动元素 -->
        <li class="stage-bar-item" [class.is-select]="tools.select" (click)="select(tools)"
            [style.order]="tools.order" designDrag="stage-bar-item">
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

  select(tools: StageTabModel) {
    this.RaDesignStageService.openStage(tools.id);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.RaDesignStageService.stageList, event.previousIndex, event.currentIndex);
  }

  // enterPredicate(drag: RaDesignDragDirective<any>, drop: RaDesignDropDirective<any>) {
  //   return drag.designDragType === 'stage-task';
  // }

  onDesignDropped($event: DesignDragDrop<any>) {
    moveItemInArray(this.RaDesignStageService.stageList, $event.currentIndex, $event.previousIndex);
  }
}
