import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  showMenu = false;

  public appPages = [
    { title: 'Perfil', url: '/profile', icon: 'person' },
    { title: 'Disciplinas', url: '/classes', icon: 'library' },
    { title: 'Eventos', url: '/events', icon: 'heart' },
    { title: 'Tarefas', url: '/tasks', icon: 'newspaper' },
    { title: 'Dashboard', url: '/dashboard', icon: 'analytics' },
  ];

  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(private auth: AuthService, private router: Router) {
    this.auth.isLoggedIn$.subscribe((isLogged) => {
      this.showMenu = isLogged;
    });
  }

  async logout() {
    try {
      await this.auth.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
}
