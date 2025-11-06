import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

type User = { email: string; password: string; name?: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private router: Router) {}

  private users(): User[] {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }
  private saveUsers(list: User[]) {
    localStorage.setItem('users', JSON.stringify(list));
  }

  signup(email: string, password: string) {
    const list = this.users();
    if (list.find(u => u.email === email)) {
      return { ok: false, msg: 'Email already exists' };
    }
    const name = email.split('@')[0]; // auto-extract username
    const user: User = { email, password, name };
    list.push(user);
    this.saveUsers(list);
    localStorage.setItem('loggedInUser', JSON.stringify(user)); // auto-login
    return { ok: true };
  }

  login(email: string, password: string) {
    const list = this.users();
    const hit = list.find(u => u.email === email && u.password === password);
    if (!hit) return { ok: false, msg: 'Invalid email or password' };
    localStorage.setItem('loggedInUser', JSON.stringify(hit));
    return { ok: true };
  }

  me(): User | null {
    const raw = localStorage.getItem('loggedInUser');
    return raw ? JSON.parse(raw) : null;
  }

  logout() {
    localStorage.removeItem('loggedInUser');
    this.router.navigateByUrl('/');
  }
}
