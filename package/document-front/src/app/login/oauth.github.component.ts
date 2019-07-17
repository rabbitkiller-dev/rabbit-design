import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLinkActive} from '@angular/router';
import {LoginService} from './login.service';

@Component({
  selector: 'app-form-normal-login',
  template: `{{status}}`,
  styles: []
})
export class OauthGithubComponent implements OnInit {
  status: string = '认证中...';

  constructor(private fb: FormBuilder, public Router: Router, public LoginService: LoginService, public ActivatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.ActivatedRoute.queryParams.subscribe((params: any) => {
      console.log(params);
      this.LoginService.oauthGithubCall(params.code);
    });
  }

  openGithub() {
    this.LoginService.oauthGithub();
    // window.open('passport/github', 'RabbitAppLoginForGithub',
    //   'height=800, width=800, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no');
  }
}
