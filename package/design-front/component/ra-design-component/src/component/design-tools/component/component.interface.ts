import {Component, ElementRef, Injector, OnInit} from '@angular/core';
import {NzFormatEmitEvent, NzTreeNodeOptions, RaDesignTreeService} from '../../design-tree';
import {RaDesignToolsInterface} from '../ra-design-tools.interface';
import {RaDesignKeyMapService, WINDOW_NAME} from '../../design-key-map/ra-design-key-map.service';
import {ComponentTree} from './registry';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ra-design-component-interface',
  templateUrl: './component.interface.html',
})
export class ComponentInterface extends RaDesignToolsInterface implements OnInit {
  nzData: NzTreeNodeOptions[] = ComponentTree;
  enterPredicate = () => false;

  constructor(
    public ElementRef: ElementRef,
    public Injector: Injector,
    public RaDesignKeyMapService: RaDesignKeyMapService,
    public TranslateService: TranslateService,
  ) {
    super(Injector);
    this.RaDesignKeyMapService.registerListenerWindow(WINDOW_NAME.SideBar_Component, ElementRef.nativeElement).subscribe(() => {
    });
  }

  ngOnInit() {
    this.TranslateService.onLangChange.subscribe(this.translateComponentTitle.bind(this));
    this.translateComponentTitle();
  }

  translateComponentTitle(event?: LangChangeEvent) {
    RaDesignTreeService.forEachTree(this.nzData, (node) => {
      this.TranslateService.get(node.key).subscribe((value) => {
        node.title = value;
      });
    });
    this.nzData = [...this.nzData];
  }

  ondbClick($event: NzFormatEmitEvent) {
    if ($event.node.children && $event.node.children.length > 0) {
      $event.node.setExpanded(!$event.node.isExpanded);
    }
  }
}
