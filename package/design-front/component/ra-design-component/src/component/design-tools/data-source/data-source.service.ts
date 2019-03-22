import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class DataSourceService {

  constructor(public HttpClient: HttpClient) {

  }

  index(): Observable<any> {
    return this.HttpClient.get('/api/data-source').pipe(map((result: any) => {
      return result.data;
    }));
  }

}
