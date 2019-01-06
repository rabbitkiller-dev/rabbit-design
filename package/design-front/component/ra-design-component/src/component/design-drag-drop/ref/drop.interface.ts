import {RaDesignDragDirective, RaDesignDropDirective} from 'ra-design-component';

export interface DropInterface {
  enterPredicate(drag: RaDesignDragDirective<any>, drop: RaDesignDropDirective<any>): boolean;
}
