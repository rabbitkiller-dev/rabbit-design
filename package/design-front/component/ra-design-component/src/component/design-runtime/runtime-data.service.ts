/**
 * 提供平台运行时的所有数据和服务
 */
import {Injectable, OnInit} from '@angular/core';
import {LocalStorageService} from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class RuntimeDataService implements OnInit {
  projectName: string;
  constructor(public LocalStorageService: LocalStorageService) {
  }

  ngOnInit() {
  }

}
