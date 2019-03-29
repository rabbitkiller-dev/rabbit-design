import {
  AfterViewInit,
  Component,
  ComponentFactory,
  OnInit,
  ViewChild,
  ViewContainerRef, ViewRef
} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '../cdk-drag-drop';
import {RaDesignStageService} from './ra-design-stage.service';
import {DesignDragDrop} from '../design-drag-drop';
import {StageTabModel} from './interface';


@Component({
  selector: 'ra-design-stage',
  template: `
    <!-- stage的上方上任务栏 -->
    <div class="stage-bar" designDrop (onDesignDropped)="onDesignDropped($event)" (wheel)="onMouseWheel($event)">
      <ng-container *ngFor="let stageTab of RaDesignStageService.stageList">
        <!-- TODO cdkDragBoundary=".stage-bar" 限制移动元素 -->
        <li class="stage-bar-item" [class.is-select]="stageTab.select" (click)="select(stageTab)"
            [style.order]="stageTab.order" designDrag="stage-bar-item">
          <i nz-icon [type]="stageTab.icon"></i>
          <span>{{stageTab.title}}</span>
          <i nz-icon type="close" theme="outline" (click)="close($event,stageTab)"></i>
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
export class RaDesignStageComponent implements OnInit, AfterViewInit {

  @ViewChild('main', {read: ViewContainerRef}) main: ViewContainerRef;
  componentRefMap: Map<string, ViewRef> = new Map();

  constructor(
    public RaDesignStageService: RaDesignStageService,
  ) {
    this.RaDesignStageService.subscribe((event) => {
      if (event.type === 'put') {
        this.reviewInterface();
      }
    });
  }

  ngOnInit() {
    this.reviewInterface();
  }

  ngAfterViewInit() {
  }

  reviewInterface() {
    this.RaDesignStageService.map((stage) => {
      if (stage.select) {
        const viewRef = this.componentRefMap.get(stage.id);
        if (viewRef) {
          this.main.detach(0);
          this.main.insert(viewRef);
        } else {
          this.main.detach(0);
          const a = this.main.createComponent(this.RaDesignStageService.getFactory(stage.factory));
          a.instance.stageID = stage.id;
          this.componentRefMap.set(stage.id, this.main.get(0));
          this.RaDesignStageService.next({type: 'open', data: stage});
        }
      }
    });
  }

  select(tools: StageTabModel) {
    this.RaDesignStageService.showStage(tools.id);
    this.reviewInterface();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.RaDesignStageService.stageList, event.previousIndex, event.currentIndex);
  }

  onDesignDropped($event: DesignDragDrop<any>) {
    moveItemInArray(this.RaDesignStageService.stageList, $event.currentIndex, $event.previousIndex);
  }

  close($event: MouseEvent, stageTab: StageTabModel) {
    if (stageTab.select && this.RaDesignStageService.stageList.length > 1) {
      const index = this.RaDesignStageService.stageList.indexOf(stageTab);
      const nextStageTab = this.RaDesignStageService.stageList[index + 1] || this.RaDesignStageService.stageList[index - 1];
      this.RaDesignStageService.showStage(nextStageTab.id);
    } else if (this.RaDesignStageService.stageList.length === 1) {
      this.main.clear();
    }
    const viewRef = this.componentRefMap.get(stageTab.id);
    if (viewRef) {
      viewRef.destroy();
    }
    this.componentRefMap.delete(stageTab.id);
    this.RaDesignStageService.deleteStage(stageTab.id);
  }

  onMouseWheel($event) {

  }
}
