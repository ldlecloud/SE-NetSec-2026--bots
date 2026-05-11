import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule,RouterLink,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  code = '';
  currentCode = '';

  @ViewChild('codeImg') codeImg!: ElementRef<HTMLImageElement>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCode();
  }

  // 获取验证码
  getCode() {
    // 获取图片
    this.http.get('/api/code', { responseType: 'blob' }).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      this.codeImg.nativeElement.src = url;
    });

    // 获取验证码文本
    this.http.get<{ code: string }>('/api/codeText').subscribe(res => {
      this.currentCode = res.code;
    });
  }

  // 登录
  login() {
    // 验证码校验
    if (this.code.toUpperCase() !== this.currentCode.toUpperCase()) {
      alert('验证码错误，请重新输入');
      this.getCode();
      return;
    }

    // 请求登录
    this.http.post('/api/login', {
      username: this.username,
      password: this.password
    }).subscribe((res: any) => {
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(res));
        this.router.navigate(['/chat']); // 跳转到聊天页
      } else {
        alert(res.msg);
        this.getCode();
      }
    });
  }
}