import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class LoginService {

  constructor(public HttpClient: HttpClient, public Router: Router) {

  }

  oauthGithub() {
    const window1 = window.open('https://github.com/login/oauth/authorize?response_type=code&client_id=2eae3c445939fe3a971b',
      'RabbitAppLoginForGithub',
      'height=750, width=750, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no');
    if (window1) {
      const timer = setInterval(() => {
        if (window1.closed) {
          clearInterval(timer);
          this.auth().subscribe((result) => {
            this.Router.navigateByUrl('/home');
          }, () => {
          });
        }
      }, 1000);
    }
  }

  oauthGithubCall(code: string, status?: string) {
    this.HttpClient.get(`oauth/github/callback?code=${code}`).subscribe((result) => {
      console.log(result);
      window.close();
    }, (error) => {
      console.log(error);
      window.close();
    });
  }

  login(name: string, password: string) {
    return this.HttpClient.post('api/auth/login', {name: name, password: password});
  }

  auth() {
    return this.HttpClient.get('api/auth');
  }
}
