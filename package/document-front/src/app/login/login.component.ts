import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLinkActive} from '@angular/router';
import {LoginService} from './login.service';

@Component({
  selector: 'app-form-normal-login',
  template: `
    <form nz-form [formGroup]="validateForm" class="login-form" (ngSubmit)="submitForm()">
      <nz-form-item>
        <nz-form-control>
          <nz-input-group [nzPrefix]="prefixUser">
            <input type="text" nz-input formControlName="userName" placeholder="Username"/>
          </nz-input-group>
          <nz-form-explain *ngIf="validateForm.get('userName')?.dirty && validateForm.get('userName')?.errors"
          >Please input your username!
          </nz-form-explain
          >
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-control>
          <nz-input-group [nzPrefix]="prefixLock">
            <input type="password" nz-input formControlName="password" placeholder="Password"/>
          </nz-input-group>
          <nz-form-explain *ngIf="validateForm.get('password')?.dirty && validateForm.get('password')?.errors"
          >Please input your Password!
          </nz-form-explain
          >
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-control>
          <label nz-checkbox formControlName="remember">
            <span>Remember me</span>
          </label>
          <a class="login-form-forgot" class="login-form-forgot">Forgot password</a>
          <button nz-button class="login-form-button" [nzType]="'primary'">Log in</button>
          Or
          <a href="">register now!</a>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <div>第三方账号登录：</div>
        <div class="oauth" (click)="openGithub()">
          <i nz-icon>
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <style type="text/css"></style>
              </defs>
              <path
                d="M511.97238362 15.03538821C237.46122714 15.03538821 14.8973037 243.23314221 14.8973037 524.67611875c0 225.18752142 142.41992249 416.18542364 339.93539381 483.57045666 24.85513482 4.72247562 33.99630063-11.07434383 33.99630064-24.52373301 0-12.17901605-0.4971027-52.30624994-0.69041998-94.86376454-138.30501642 30.82036717-167.44075821-60.12180987-167.4407582-60.12180986-22.61817268-58.93428589-55.17839929-74.59302082-55.17839929-74.59302084-45.09826085-31.67648805 3.42448481-30.95845168 3.4244848-30.95845169 49.90358691 3.56256933 76.16717937 52.49956852 76.16718067 52.49956853 44.35260682 77.90703882 116.32203093 55.37171658 144.62926694 42.36419602 4.47392427-32.94686246 17.34336031-55.42695063 31.56602122-68.15830347-110.41203265-12.86943604-226.48551222-56.55924054-226.48551094-251.8929825 0-55.62026791 19.44223922-101.10516463 51.20157773-136.78609192-5.16434425-12.86943604-22.17630405-64.6509669 4.77770838-134.85291522 0 0 41.75662649-13.69794053 136.75847555 52.2234008a466.0061614 466.0061614 0 0 1 124.3861409-17.15004303c42.25372918 0.19331728 84.81124379 5.85476553 124.52422542 17.15004303 94.86376453-65.92134132 136.56515697-52.22339949 136.56515827-52.2234008 27.03686288 70.20194701 10.05252077 122.06632833 4.9157929 134.85291522 31.86980662 35.6809273 51.14634365 81.16582401 51.14634366 136.78609192 0 195.7479955-116.32203093 238.83022918-226.98261364 251.45111388 17.840463 15.79681945 33.74774928 46.8105039 33.74774929 94.33904547 0 68.15830346-0.55233676 123.0881514-0.55233676 139.82394088 0 13.55985731 8.94784853 29.43952592 34.16200282 24.46850024C866.87609108 940.58537467 1009.1026963 749.61508883 1009.1026963 524.53803424 1009.1026963 243.0950577 786.53877286 14.8973037 512.02761638 14.8973037l-0.05523276 0.13808451z m0 0"></path>
            </svg>

          </i>
        </div>
      </nz-form-item>
    </form>
    <ng-template #prefixUser><i nz-icon type="user"></i></ng-template>
    <ng-template #prefixLock><i nz-icon type="lock"></i></ng-template>
  `,
  styles: [
      `
      .oauth [nz-icon] {
        font-size: 24px;
        cursor: pointer;
        width: 45px;
        height: 45px;
      }

      .oauth {
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin-top: 15px;
      }

      [nz-form] {
        margin: auto;
        position: fixed;
        top: calc(50% - 208px);
        left: calc(50% - 150px);
      }

      .login-form {
        padding: 20px;
        box-shadow: 0 0 11px 1px #e3e3e3;
        max-width: 300px;
      }

      .login-form-forgot {
        float: right;
      }

      .login-form-button {
        width: 100%;
      }
    `
  ]
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;

  constructor(private fb: FormBuilder, public Router: Router, public LoginService: LoginService, public ActivatedRoute: ActivatedRoute) {
  }

  submitForm(): void {
    for (const i of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this.LoginService.login(this.validateForm.value.userName, this.validateForm.value.password).subscribe((result) => {
        console.log(name);
        this.Router.navigateByUrl('/home');
      });
    }
  }

  ngOnInit(): void {
    this.LoginService.auth().subscribe((result) => {
      this.Router.navigateByUrl('/home');
    }, () => {
    });
    this.ActivatedRoute.params.subscribe((params: any) => {
      console.log(params);
    });
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  openGithub() {
    this.LoginService.oauthGithub();
    // window.open('passport/github', 'RabbitAppLoginForGithub',
    //   'height=800, width=800, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no');
  }
}
