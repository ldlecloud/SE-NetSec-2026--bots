import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router,RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  selector: 'app-register',
  imports: [FormsModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username = '';
  pwd = '';
  repwd = '';
  pwdTipShow = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register() {
    // 1. 校验密码
    if (this.pwd !== this.repwd) {
      this.pwdTipShow = true;
      return;
    }
    this.pwdTipShow = false;

    // 2. 发送注册请求
    this.http.post('/api/register', {
      username: this.username,
      password: this.pwd
    }).subscribe((res: any) => {
      if (res.ok) {
        alert('注册成功！即将跳转到登录页面');
        this.router.navigate(['/login']);
      } else {
        alert(res.msg);
      }
    });
  }
}