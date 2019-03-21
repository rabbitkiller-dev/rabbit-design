import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NzFormatEmitEvent, NzTreeNodeOptions, TreeNodeModel} from '../../design-tree';

@Component({
  selector: 'ra-design-component-interface',
  templateUrl: './images.interface.html',
})
export class ImagesInterface implements OnInit {
  images = [];
  constructor(public cdf: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.images = [
      './assets/beiou/HB036.jpg',
      './assets/beiou/HB037.jpg',
      './assets/beiou/HB038.jpg',
      './assets/beiou/HB039.jpg',
      './assets/beiou/HB040.jpg'
    ];
    this.cdf.markForCheck();
    console.log(this.images);
  }
  onClickImage(image){

  }
}
