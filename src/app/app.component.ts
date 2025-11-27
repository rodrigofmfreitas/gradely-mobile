// src/app/app.component.ts

import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth';
import {
  DocumentData,
  DocumentReference,
  Firestore,
  doc,
  docData,
} from '@angular/fire/firestore';
import { User } from '@angular/fire/auth';
import { Observable, Subscription, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { TasksService } from './services/tasks.service';
import { TaskItem } from './models/task'; // Import TaskItem model

interface SidebarProfile {
  fullName: string;
  email: string;
}

interface UserFirestoreData {
  fullName: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
  showMenu = true;
  private auth = inject(AuthService);
  private firestore = inject(Firestore);
  private router = inject(Router);
  // 1. ✅ Make TasksService public to access its methods in the template
  public taskService = inject(TasksService);

  public sidebarProfile$: Observable<SidebarProfile | null> = of(null);
  private authStateSubscription: Subscription | null = null;

  // 2. ✅ New Observable for urgent tasks (yellow/red urgency)
  public urgentAlerts$!: Observable<TaskItem[]>;

  private getUserDocRef(
    uid: string
  ): DocumentReference<UserFirestoreData, DocumentData> {
    return doc(this.firestore, 'users', uid) as DocumentReference<
      UserFirestoreData,
      DocumentData
    >;
  }

  public appPages = [
    { title: 'Perfil', url: '/profile', icon: 'person' },
    { title: 'Disciplinas', url: '/classes', icon: 'library' },
    // { title: 'Eventos', url: '/events', icon: 'heart' },
    { title: 'Tarefas', url: '/tasks', icon: 'newspaper' },
    { title: 'Dashboard', url: '/dashboard', icon: 'analytics' },
  ];

  public labels: string[] = []; // Initialize as an empty array of strings

  ngOnInit() {
    this.setupSidebarProfile();
    // 3. ✅ Fetch urgent tasks for the sidebar
    this.urgentAlerts$ = this.taskService.getUrgentTasks();
  }

  ngOnDestroy(): void {
    this.authStateSubscription?.unsubscribe();
  }

  setupSidebarProfile() {
    this.sidebarProfile$ = this.auth.authState.pipe(
      switchMap((user: User | null) => {
        if (!user) {
          return of(null);
        }
        const userDocRef = this.getUserDocRef(user.uid);
        return docData<UserFirestoreData>(userDocRef).pipe(
          map((profileData: UserFirestoreData | undefined) => {
            if (profileData && profileData.fullName) {
              // Only show first name if it exists in Firestore
              const firstName = profileData.fullName.split(' ')[0];
              return {
                fullName: firstName,
                email: user.email || 'N/A',
              } as SidebarProfile;
            }
            return {
              fullName: 'Usuário',
              email: user.email || 'N/A',
            } as SidebarProfile;
          })
        );
      })
    );
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
