import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgxChartsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  private router = inject(Router);

  get showLogout(): boolean {
    return (this.router.url || '/').startsWith('/dashboard');
  }

  logout() {
    localStorage.removeItem('loggedInUser');
    this.router.navigateByUrl('/');
  }
}
