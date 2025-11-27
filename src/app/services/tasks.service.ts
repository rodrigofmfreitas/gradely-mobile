// src/app/services/tasks.service.ts

import { LocalNotifications } from '@capacitor/local-notifications';
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  query,
  where,
  collectionData,
  updateDoc,
  getDocs,
  orderBy,
  limit,
  docData,
} from '@angular/fire/firestore';
import { AuthService } from './auth';
import { ClassesService } from './classes';
import {
  Observable,
  switchMap,
  filter,
  map,
  from,
  combineLatest,
  take,
  of,
  tap,
} from 'rxjs';
import { User } from '@angular/fire/auth';
import { TaskItem, NewTaskForm, TaskType } from '../models/task';
import { ClassItem } from '../models/classModel'; // Use ClassItem for active class list

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private firestore = inject(Firestore);
  private auth = inject(AuthService);
  private classesService = inject(ClassesService);
  private taskUrgencyCache = new Map<string, string>();

  private getTasksCollection(uid: string) {
    return collection(this.firestore, `users/${uid}/tasks`);
  }

  // --- READ Operations ---

  /** Fetches all non-archived tasks for the current user. */
  getTasks(): Observable<TaskItem[]> {
    return this.auth.authState.pipe(
      filter((user: User | null): user is User => !!user),
      switchMap((user: User) => {
        const tasksRef = this.getTasksCollection(user.uid);
        // Fetch tasks that are NOT archived
        const tasksQuery = query(tasksRef, where('isArchived', '==', false));

        return collectionData(tasksQuery, { idField: 'id' }) as Observable<
          TaskItem[]
        >;
      })
    );
  }

  /** Fetches details for a single task by ID. */
  getTaskDetails(taskId: string): Observable<TaskItem | null> {
    return this.auth.authState.pipe(
      switchMap((user: User | null) => {
        if (!user || !taskId) {
          return of(null);
        }
        const docRef = doc(this.getTasksCollection(user.uid), taskId);
        return docData(docRef, { idField: 'id' }).pipe(
          map((data) => data as TaskItem),
          map((data) => data || null)
        );
      })
    );
  }

  /** Gets active classes formatted for use in a dropdown/select. */
  getActiveClassesForForm(): Observable<ClassItem[]> {
    // Reuses the ClassesService to get the list of active classes
    return this.classesService.getActiveClasses();
  }

  // --- WRITE Operations ---

  /** Determines the next sequential task number (e.g., 3 for Prova 3) */
  private async getNextTaskNumber(
    uid: string,
    classId: string,
    taskType: TaskType
  ): Promise<number> {
    const tasksRef = this.getTasksCollection(uid);
    // Find the latest task of the same type and class
    const latestTaskQuery = query(
      tasksRef,
      where('classId', '==', classId),
      where('taskType', '==', taskType),
      orderBy('taskNumber', 'desc'),
      limit(1)
    );

    const snapshot = await getDocs(latestTaskQuery);

    if (snapshot.empty) {
      return 1;
    }
    // The latest task's number + 1
    return (snapshot.docs[0].data() as TaskItem).taskNumber + 1;
  }

  /** Adds a new task after calculating its sequence number. */
  async addTask(formData: NewTaskForm): Promise<void> {
    const user = await this.auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado.');

    // 1. Get the current class name for caching (needed for the card display)
    const classDetails$ = this.classesService
      .getClassDetails(formData.classId)
      .pipe(take(1));
    const classDetails = await classDetails$.toPromise();

    if (!classDetails) throw new Error('Classe associada não encontrada.');

    // 2. Determine the sequential task number
    const taskNumber = await this.getNextTaskNumber(
      user.uid,
      formData.classId,
      formData.taskType
    );

    // 3. Create the document
    const docRef = doc(this.getTasksCollection(user.uid));

    await setDoc(docRef, {
      classId: formData.classId,
      className: classDetails.className, // Cache the name
      taskType: formData.taskType,
      taskNumber: taskNumber,
      dueDate: formData.dueDate,
      pointsWorth: formData.pointsWorth,
      isCompleted: false,
      isArchived: false,
    } as TaskItem);
  }

  /** Marks a task as completed (changes status without archiving/grading). */
  async completeTask(taskId: string): Promise<void> {
    const user = await this.auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado.');

    const docRef = doc(this.getTasksCollection(user.uid), taskId);
    await updateDoc(docRef, { isCompleted: true });
  }

  /** Archives a task and stores the received grade. */
  async archiveTask(taskId: string, pointsReceived: number): Promise<void> {
    const user = await this.auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado.');

    const docRef = doc(this.getTasksCollection(user.uid), taskId);
    await updateDoc(docRef, {
      pointsReceived: pointsReceived,
      isArchived: true,
      isCompleted: true, // Should be completed if archived
    });
  }

  getUrgencyColor(task: TaskItem): string {
    if (task.isArchived || task.isCompleted) {
      return 'blue'; // Blue if completed or archived
    }

    const today = new Date().getTime();
    const dueDate = new Date(task.dueDate).getTime();
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24)); // Difference in days

    if (diffDays <= 4) {
      return 'red'; // Under 5 days
    } else if (diffDays <= 9) {
      return 'yellow'; // 5 to 9 days
    } else {
      return 'green'; // 10+ days
    }
  }

  /** Gets all active tasks that have high urgency (yellow or red marker). */
  getUrgentTasks(): Observable<TaskItem[]> {
    return this.getTasks().pipe(
      map((tasks) =>
        tasks.filter((task) => {
          const color = this.getUrgencyColor(task);
          // We only want tasks that are yellow or red (high urgency)
          return color === 'yellow' || color === 'red';
        })
      )
    );
  }

  getTasksByClassId(classId: string): Observable<TaskItem[]> {
    return this.auth.authState.pipe(
      filter((user: User | null): user is User => !!user),
      switchMap((user: User) => {
        const tasksRef = this.getTasksCollection(user.uid);
        // Query tasks where classId matches the provided ID
        const tasksQuery = query(
          tasksRef,
          where('classId', '==', classId),
          // Optional: Order by due date to keep the list organized
          orderBy('dueDate', 'asc')
        );

        return collectionData(tasksQuery, { idField: 'id' }) as Observable<
          TaskItem[]
        >;
      })
    );
  }

  monitorTaskUrgency(): void {
    // Combine the Observable with a side effect (tap) to monitor urgency
    this.getTasks()
      .pipe(
        tap((tasks) => {
          const now = Date.now();
          tasks.forEach((task) => {
            const newColor = this.getUrgencyColor(task);
            const oldColor = this.taskUrgencyCache.get(task.id);

            // Check if the task is getting more urgent (Green->Yellow, Yellow->Red)
            const isUrgencyIncrease =
              (oldColor === 'green' && newColor === 'yellow') ||
              (oldColor === 'yellow' && newColor === 'red');

            const isRed = newColor === 'red' && oldColor !== 'red';

            if (isUrgencyIncrease || isRed) {
              this.scheduleUrgencyNotification(task, newColor);
            }

            // Update cache
            this.taskUrgencyCache.set(task.id, newColor);
          });
        })
      )
      .subscribe(); // Subscribe to start monitoring the stream
  }

  private async scheduleUrgencyNotification(task: TaskItem, newColor: string) {
    // Notification text based on new urgency
    let title = '';
    let body = `Entrega em ${new Date(task.dueDate).toLocaleDateString()}.`;

    if (newColor === 'yellow') {
      title = '⚠️ Alerta de Prazo: Tarefa se Tornou Urgente!';
    } else if (newColor === 'red') {
      title = '🚨 ULTIMA CHAMADA: Prazo Final Iminente!';
    } else {
      return; // Don't notify if color is blue/green
    }
    await LocalNotifications.schedule({
      notifications: [
        {
          title: title,
          body: `${task.taskType} ${task.taskNumber} (${task.className}). ${body}`, // ✅ CORRECTED: Call the instance method 'this.hashCode()' on the string
          id: this.hashCode(task.id) % 10000,
          sound: 'default', // ...
        },
      ],
    });
  }

  private hashCode(s: string): number {
    let hash = 0,
      i,
      chr;
    for (i = 0; i < s.length; i++) {
      chr = s.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}
