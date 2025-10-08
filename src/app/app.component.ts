import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  public appPages = [
    { title: 'Perfil', url: '/profile', icon: 'person' },
    { title: 'Disciplinas', url: '/classes', icon: 'library' },
    { title: 'Eventos', url: '/events', icon: 'heart' },
    { title: 'Tarefas', url: '/tarefas', icon: 'newspaper' },
    { title: 'Dashboard', url: '/dashboard', icon: 'analytics' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {}
}
