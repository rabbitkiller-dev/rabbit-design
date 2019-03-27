import {AfterViewInit, Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'design-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit, OnInit {
  user: any;

  constructor(public HttpCliend: HttpClient) {
  }

  ngOnInit() {
    this.HttpCliend.get('api/auth').subscribe((result: any) => {
      if (result.code = 'sys.notLogin') {
        this.HttpCliend.post('api/auth/login', {account: 'rabbit@rabbit.com', password: 'rabbit'}).subscribe((_result: any) => {
          this.user = _result.data;
        }, (_result) => {
          this.HttpCliend.post('api/auth/register', {userName: 'rabbit', email: 'rabbit@rabbit.com', password: 'rabbit'})
            .subscribe((__result: any) => {
              console.log(__result);
          });
        });
      } else {
        this.user = result.data;
      }
    });
  }

  ngAfterViewInit() {
  }
}
