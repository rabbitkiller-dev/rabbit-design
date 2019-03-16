import {Injectable} from '@angular/core';
import {Observable, Observer, Subject} from 'rxjs';
import {DesignMenuModel} from './interface';
import {RaDesignMenuItem} from './ra-design-menu-item';

@Injectable({providedIn: 'root'})
export class RaDesignMenuService {
  public subject: Subject<{ x: number, y: number, item: DesignMenuModel[] }> = new Subject<{ x: number, y: number, item: DesignMenuModel[] }>();
  private event: Subject<RaDesignMenuItem>;

  constructor() {
  }

  show(element: HTMLElement, item: DesignMenuModel[]);
  show($event: MouseEvent, item: DesignMenuModel[]);
  show($event: HTMLElement | MouseEvent, item: DesignMenuModel[]): Observable<any> {
    if (this.event) {
      this.event.unsubscribe();
    }
    this.event = new Subject<RaDesignMenuItem>();
    if ($event instanceof HTMLElement) {
      this.subject.next({item, ...this.elementToXY($event)});
    } else {
      this.subject.next({item, ...this.eventToXY($event)});
    }
    return this.event.asObservable();
  }

  emit(data: any) {
    this.event.next(data);
    this.event.unsubscribe();
  }

  /**
   * 用鼠标事件算出坐标
   * 一般在鼠标的右下角位置距离5px
   * @param mouse event
   */
  private eventToXY($event: MouseEvent): { x: number, y: number } {
    return {x: $event.pageX, y: $event.pageY};
  }

  /**
   * 用元素算出坐标
   * 一般在元素的正文x坐标对齐
   * @param mouse event
   */
  private elementToXY(element: HTMLElement): { x: number, y: number } {
    const rect = element.getClientRects();
    console.log(rect);
    return {x: 0, y: 0};
  }
}
