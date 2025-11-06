import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  showPass = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    const res = this.auth.login(this.email.trim(), this.password);
    if (!res.ok) { this.error = res.msg || 'Login failed'; return; }
    this.router.navigateByUrl('/dashboard');
  }

  continueWithoutLogin() {
    localStorage.removeItem('loggedInUser');
    this.router.navigateByUrl('/dashboard');
  }
}
