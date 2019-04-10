import {Component, ElementRef, Injector, OnInit} from '@angular/core';
import {NzFormatEmitEvent, NzTreeNodeOptions} from '../../design-tree';
import {RaDesignToolsInterface} from '../ra-design-tools.interface';
import {RaDesignKeyMapService, WINDOW_NAME} from '../../design-key-map/ra-design-key-map.service';

@Component({
  selector: 'ra-design-component-interface',
  templateUrl: './component.interface.html',
})
export class ComponentInterface extends RaDesignToolsInterface implements OnInit {
  nzData: NzTreeNodeOptions[] = [];
  enterPredicate = () => false;

  constructor(
    public ElementRef: ElementRef,
    public Injector: Injector,
    public RaDesignKeyMapService: RaDesignKeyMapService,
  ) {
    super(Injector);
    this.RaDesignKeyMapService.registerListenerWindow(WINDOW_NAME.SideBar_Component, ElementRef.nativeElement).subscribe(() => {
    });
  }

  ngOnInit() {
    this.nzData = [
      {
        key: 'general',
        title: 'general',
        expanded: true,
        children: [
          {
            key: 'icon',
            title: 'icon',
            isLeaf: true,
            icon: 'rabbit-design:icon-iconfont'
          },
          {
            key: 'button',
            title: 'button',
            isLeaf: true,
            icon: 'rabbit-design:icon-button'
          },
        ]
      },
      {
        key: 'layout',
        title: 'layout',
        expanded: true,
        children: [
          {
            key: 'grid',
            title: 'grid',
            isLeaf: true,
            icon: 'rabbit-design:icon-button'
          },
          {
            key: 'top-center-bottom',
            title: 'top-center-bottom',
            isLeaf: true,
            icon: 'rabbit-design:icon-button'
          },
          {
            key: 'top-right-content',
            title: 'top-right-content',
            isLeaf: true,
            icon: 'rabbit-design:icon-button'
          },
          {
            key: 'top-left-content',
            title: 'top-right-content',
            isLeaf: true,
            icon: 'rabbit-design:icon-button'
          },
        ]
      },
      {
        key: 'navigation',
        title: 'navigation',
        expanded: true,
        children: [
          {
            key: 'affix',
            title: 'affix',
            isLeaf: true,
            icon: 'rabbit-design:icon-iconfont'
          },
          {
            key: 'breadcrumb',
            title: 'breadcrumb',
            isLeaf: true,
            icon: 'rabbit-design:icon-button'
          },
          {
            key: 'dropdown',
            title: 'dropdown',
            isLeaf: true,
            icon: 'rabbit-design:icon-button'
          },
          {
            key: 'header-menu',
            title: 'header-menu',
            isLeaf: true,
            icon: 'rabbit-design:icon-button'
          },
          {
            key: 'menu',
            title: 'menu',
            isLeaf: true,
            icon: 'rabbit-design:icon-button'
          },
          {
            key: 'pagination',
            title: 'pagination',
            isLeaf: true,
            icon: 'rabbit-design:icon-button'
          },
          {
            key: 'steps',
            title: 'steps',
            isLeaf: true,
            icon: 'rabbit-design:icon-button'
          },
        ]
      },
      {
        key: 'forms',
        title: 'forms',
        expanded: true,
        children: [
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
