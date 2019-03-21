import {
  ComponentFactory,
  ComponentRef,
  Directive, ElementRef, Host, HostListener, InjectFlags, Injector, Input, OnInit, ViewContainerRef, Inject
} from '@angular/core';
import {NzIconDirective} from './icon';
import {PageEditorService} from '../design-stage/page-editor/page-editor.service';
import {HtmlJson} from 'himalaya';
import {PropertiesEditorService} from '../design-tools/properties-editor/properties-editor.service';


@Directive({
  selector: '[design-dynamic-unit]',
})
export class RaDesignDynamicUnitDirective implements OnInit {
  @Input('design-dynamic-unit') path: string;
  htmlJson: HtmlJson;

  @HostListener('click', ['$event']) onClick($event) {
    this.PropertiesEditorService.openPropertiePanel(this.htmlJson);
  }

  constructor(
    public ElementRef: ElementRef,
    public ViewC: ViewContainerRef,
    public PageEditorService: PageEditorService,
    public PropertiesEditorService: PropertiesEditorService
  ) {
  }

  ngOnInit(): void {
    this.htmlJson = this.PageEditorService.getNodeJson(this.path);
  }

}


