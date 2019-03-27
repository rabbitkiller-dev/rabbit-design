import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NzIconService} from 'ng-zorro-antd';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class IconService {
  constructor(public HttpClient: HttpClient, public NzIconService: NzIconService) {
  }

  index() {
    return this.HttpClient.get('/api/tools-icon').pipe(map((result: any) => {
      result.data.forEach((icon) => {
        this.NzIconService.addIconLiteral(`rabbit-design:${icon.fontClass}`, icon.svg);
      });
      return result.data;
    }));
  }

}
