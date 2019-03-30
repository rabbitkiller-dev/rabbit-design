/**
 * 一些变量就存在这里,还有初始化舞台的操作
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
