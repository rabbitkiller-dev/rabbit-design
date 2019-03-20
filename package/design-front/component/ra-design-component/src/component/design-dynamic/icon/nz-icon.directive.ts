import {
  AfterContentChecked,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import { IconDirective, ThemeType } from '@ant-design/icons-angular';
import { InputBoolean } from '../core/util';
import { NzIconService } from './nz-icon.service';

const iconTypeRE = /^anticon\-\w/;

const getIconTypeClass = (className: string): { name: string, index: number } | undefined => {
  if (!className) {
    return undefined;
  } else {
    const classArr = className.split(/\s/);
    const index = classArr.findIndex((cls => cls !== 'anticon' && cls !== 'anticon-spin' && !!cls.match(iconTypeRE)));
    return index === -1 ? undefined : { name: classArr[ index ], index };
  }
};

const normalizeType = (rawType: string): { type: string, crossError: boolean, verticalError: boolean } => {
  const ret = { type: rawType, crossError: false, verticalError: false };
  ret.type = rawType ? rawType.replace('anticon-', '') : '';
  if (ret.type.includes('verticle')) {
    ret.type = 'up';
    ret.verticalError = true;
  }
  if (ret.type.startsWith('cross')) {
    ret.type = 'close';
    ret.crossError = true;
  }
  return ret;
};

/**
 * This directive extends IconDirective to provide:
 *
 * - IconFont support
 * - spinning
 * - old API compatibility
 *
 * @break-changes
 *
 * - old API compatibility, icon class names would not be supported.
 * - properties that not started with `nz`.
 */
@Directive({
  selector: 'i.anticon, [nz-icon]'
})
export class NzIconDirective extends IconDirective implements OnInit, OnChanges, OnDestroy, AfterContentChecked {
  /** Properties with `nz` prefix. */
  @Input() @InputBoolean() set nzSpin(value: boolean) { this.spin = value; }
  @Input() nzRotate: number = 0;
  @Input() set nzType(value: string) { this.type = value; }
  @Input() set nzTheme(value: ThemeType) { this.theme = value; }
  @Input() set nzTwotoneColor(value: string) { this.twoToneColor = value; }
  @Input() set nzIconfont(value: string) { this.iconfont = value; }

  /** @deprecated 8.0.0 avoid exposing low layer API. */
  @Input() spin = false;

  /** @deprecated 8.0.0 avoid exposing low layer API. */
  @Input() iconfont: string;

  @Input()
  set type(value: string) {
    if (value && value.startsWith('anticon')) {
      const rawClass = getIconTypeClass(value);
      const type = rawClass ? normalizeType(rawClass.name).type : '';
      if (type && this.type !== type) {
        this._type = type;
      }
    } else {
      this._type = value;
    }
  }

  get type(): string {
    return this._type;
  }

  private classNameObserver: MutationObserver;
  private el = this.elementRef.nativeElement;
  private _type: string;

  /**
   * Replacement of `changeIcon` for more modifications.
   * @param oldAPI
   */
  private changeIcon2(oldAPI: boolean = false): void {
    if (!oldAPI) {
      this.setClassName();
    }
    this._changeIcon()
      .then(svg => {
        this.setSVGData(svg);
        if (!oldAPI && svg) {
          this.handleSpin(svg);
          this.handleRotate(svg);
        }
      });
  }

  private classChangeHandler(className: string): void {
    const ret = getIconTypeClass(className);
    if (ret) {
      const { type, crossError, verticalError } = normalizeType(ret.name);
      if (crossError) {
        this.iconService.warnAPI('cross');
      }
      if (verticalError) {
        this.iconService.warnAPI('vertical');
      }
      if (this.type !== type) {
        this._type = type;
        this.changeIcon2(true);
      }
    }
  }

  private handleSpin(svg: SVGElement): void {
    if ((this.spin || this.type === 'loading') && !this.elementRef.nativeElement.classList.contains('anticon-spin')) {
      this.renderer.addClass(svg, 'anticon-spin');
    } else {
      this.renderer.removeClass(svg, 'anticon-spin');
    }
  }

  private handleRotate(svg: SVGElement): void {
    if (this.nzRotate) {
      this.renderer.setAttribute(svg, 'style', `transform: rotate(${this.nzRotate}deg)`);
    } else {
      this.renderer.removeAttribute(svg, 'style');
    }
  }

  private setClassName(): void {
    if (typeof this.type === 'string') {
      const iconClassNameArr = this.el.className.split(/\s/);
      const ret = getIconTypeClass(this.el.className);
      if (ret) {
        iconClassNameArr.splice(ret.index, 1, `anticon-${this.type}`);
        this.renderer.setAttribute(this.el, 'class', iconClassNameArr.join(' '));
      } else {
        this.renderer.addClass(this.el, `anticon-${this.type}`);
      }
    }
  }

  private setSVGData(svg: SVGElement | null): void {
    if (typeof this.type === 'string' && svg) {
      this.renderer.setAttribute(svg, 'data-icon', this.type);
      this.renderer.setAttribute(svg, 'aria-hidden', 'true');
    }
  }

  constructor(public iconService: NzIconService, public elementRef: ElementRef, public renderer: Renderer2) {
    super(iconService, elementRef, renderer);
    const RaDesignIconIconfontLiteral = '<svg viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1127" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M1.703827 0h1022.296173v1022.296173H1.703827z" fill="#E94618"></path><path d="M501.799188 865.690622c-38.777398-23.478735-30.512133-64.416586-55.495348-90.18356-45.955621-47.388539-126.495521-49.818196-173.427434-104.054416-157.356938-181.844339-6.25986-521.808932 291.356113-471.721531 173.442769 29.18826 305.577957 272.184652 187.299993 443.973005-50.872865 73.896679-148.708313 79.747621-208.112239 159.553171-17.406296 17.273398-8.592399 60.780619-41.621085 62.433331zM252.06416 470.276686c-6.982283 131.959694 180.363714 125.277285 180.363714 6.937983 0-60.245617-54.101617-108.603634-124.866663-83.245577-49.779008 17.835661-53.437125 37.388779-55.497051 76.307594z m381.53797 97.11984c158.950017 44.573817 162.964233-230.536306 0-173.427434-77.096466 27.017584-68.110483 154.329238 0 173.427434z m-159.551468 83.247281c25.407468 5.697597 32.996313-68.502363 6.93628-69.374722-14.470602 14.327481-48.605072 59.225025-6.93628 69.374722z m62.429924 0h13.879374c17.914037-28.413018-6.004286-65.42014-34.686509-69.374722 2.320612 27.740007-8.91783 69.037364 20.807135 69.374722z" fill="#FFFFFF"></path></svg>'
    this.iconService.addIconLiteral('rabbit-design:icon-iconfont', RaDesignIconIconfontLiteral);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { type, nzType, nzTwotoneColor, twoToneColor, spin, nzSpin, theme, nzTheme, nzRotate } = changes;

    if (type || nzType || nzTwotoneColor || twoToneColor || spin || nzSpin || theme || nzTheme) {
      this.changeIcon2();
    } else if (nzRotate) {
      this.handleRotate(this.el.firstChild);
    } else {
      this._setSVGElement(this.iconService.createIconfontIcon(`#${this.iconfont}`));
    }
  }

  ngOnInit(): void {
    // If `this.type` is not specified and `classList` contains `anticon`, it should be an icon using old API.
    if (!this.type && this.el.classList.contains('anticon')) {
      this.iconService.warnAPI('old');
      // Get `type` from `className`. If not, initial rendering would be missed.
      this.classChangeHandler(this.el.className);
      // Add `class` mutation observer.
      this.classNameObserver = new MutationObserver((mutations: MutationRecord[]) => {
        mutations
          .filter((mutation: MutationRecord) => mutation.attributeName === 'class')
          .forEach((mutation: MutationRecord) => this.classChangeHandler((mutation.target as HTMLElement).className));
      });
      this.classNameObserver.observe(this.el, { attributes: true });
    }
    // If `classList` does not contain `anticon`, add it before other class names.
    if (!this.el.classList.contains('anticon')) {
      this.renderer.setAttribute(this.el, 'class', `anticon ${this.el.className}`.trim());
    }
  }

  ngOnDestroy(): void {
    if (this.classNameObserver) {
      this.classNameObserver.disconnect();
    }
  }

  /**
   * If custom content is provided, try to normalize SVG elements.
   */
  ngAfterContentChecked(): void {
    const children = this.el.children;
    let length = children.length;
    if (!this.type && children.length) {
      while (length--) {
        const child = children[ length ];
        if (child.tagName.toLowerCase() === 'svg') {
          this.iconService.normalizeSvgElement(child as SVGElement);
        }
      }
    }
  }
}
