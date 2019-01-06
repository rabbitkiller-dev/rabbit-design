import {
  AfterViewInit,
  Component,
} from '@angular/core';
import {RaDesignHeaderService} from './ra-design-header.service';

@Component({
  selector: 'ra-design-header',
  templateUrl: './ra-design-header.component.html',
  styles: []
})
export class RaDesignHeaderComponent implements AfterViewInit {

  constructor(public RaDesignHeaderService: RaDesignHeaderService) {
  }

  ngAfterViewInit() {
  }
}
