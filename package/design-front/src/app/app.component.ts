import { Component } from '@angular/core';
import {RaIconService} from 'ra-component';

@Component({
  selector: 'design-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'design-front';

  constructor(IconServer: RaIconService) {
    IconServer.fetchFromIconfont({
      scriptUrl: 'https://at.alicdn.com/t/font_416155_9wyzq012g8f.js',
    });
  }

}
