import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  email = '';
  password = '';
  confirm = '';
  showPass = false;
  showConfirm = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    if (this.password !== this.confirm) { this.error = 'Passwords do not match'; return; }
    const res = this.auth.signup(this.email.trim(), this.password);
    if (!res.ok) { this.error = res.msg || 'Could not create account'; return; }
    this.router.navigateByUrl('/dashboard'); 
  }
}
