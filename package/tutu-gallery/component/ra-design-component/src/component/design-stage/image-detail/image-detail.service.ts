import {Injectable} from '@angular/core';
import {ImageDetailInterface} from './image-detail.interface';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ImageDetailService extends Subject<{ type: 'detail', data: any }> {
  ImageDetailInterface: ImageDetailInterface;
}
