// src/app/services/classes.service.ts

import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, setDoc, updateDoc, query, where, collectionData, DocumentData, DocumentReference, getDoc, docData } from '@angular/fire/firestore';
import { AuthService } from './auth'; // Adjust path as necessary
import { Observable, switchMap, filter, map, of, combineLatest } from 'rxjs';
import { User } from '@angular/fire/auth';
import { ClassItem, NewClassForm } from '../models/classModel'; // Import the model
import { TasksService } from './tasks.service';

interface ComputedClassItem extends ClassItem {
  currentGrade: number; // The sum of pointsReceived
  totalPointsPossible: number; // Sum of pointsWorth for all tasks
}

@Injectable({
  providedIn: 'root'
})

export class ClassesService {
  private firestore = inject(Firestore);
  private auth = inject(AuthService);
  private tasksService = inject(TasksService); // Inject the TasksService

  private getClassesCollection(uid: string) {
    return collection(this.firestore, `users/${uid}/classes`);
  }

  // --- READ Operations ---

  /** Fetches all active classes for the current user. */
  getActiveClasses(): Observable<ClassItem[]> {
    return this.auth.authState.pipe(
      filter((user: User | null): user is User => !!user),
      switchMap((user: User) => {
        const classesRef = this.getClassesCollection(user.uid);
        // Query only active classes (isCompleted == false)
        const activeClassesQuery = query(classesRef, where('isCompleted', '==', false));

        // Return Observable, mapping doc ID to 'id' property
        return collectionData(activeClassesQuery, { idField: 'id' }) as Observable<ClassItem[]>;
      })
    );
  }

  /** Fetches details for a single class by ID. */
  getClassDetails(classId: string): Observable<ClassItem | null> {
    return this.auth.authState.pipe(
      switchMap((user: User | null) => {
        if (!user || !classId) {
          return of(null);
        }

        // Use docData to stream updates for the specific document
        const docRef = doc(this.getClassesCollection(user.uid), classId);

        // Ensure the ID is included in the output object
        return docData(docRef, { idField: 'id' }).pipe(
            map(data => data as ClassItem),
            // Handle case where docData returns undefined (doc not found)
            map(data => data || null)
        );
      })
    );
  }

  // --- WRITE Operations ---

  /** Adds a new class to the user's subcollection. */
  async addClass(data: NewClassForm): Promise<void> {
    const user = await this.auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado.");

    const docRef = doc(this.getClassesCollection(user.uid)); // Auto-generated ID

    await setDoc(docRef, {
      university: data.university,
      className: data.className,
      course: data.course,
      currentGrade: 0,
      isCompleted: false, // Starts active
    });
  }

  /** Updates the 'isCompleted' status of a class (Archives it). */
  async finalizeClass(classId: string): Promise<void> {
    const user = await this.auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado.");

    const docRef = doc(this.getClassesCollection(user.uid), classId);

    await updateDoc(docRef, { isCompleted: true });
  }

  getComputedClassDetails(classId: string): Observable<ComputedClassItem | null> {
  // 1. Get the base class details
    const classDetails$ = this.getClassDetails(classId);

    // 2. Get ALL tasks for that class
    const classTasks$ = this.tasksService.getTasksByClassId(classId);

    // Combine both streams
    return combineLatest([classDetails$, classTasks$]).pipe(
      map(([classDetails, tasks]) => {
        if (!classDetails) return null;

        let acquiredPoints = 0;
        let possiblePoints = 0;

        // Iterate through all tasks associated with this class
        tasks.forEach(task => {
          // A task must be archived to count towards the final grade calculation
          if (task.isArchived) {
            acquiredPoints += task.pointsReceived || 0; // Use pointsReceived
          }

          // Count all points possible, regardless of archive status
          possiblePoints += task.pointsWorth || 0;
        });

        // Return the class details plus the computed grades
        return {
          ...classDetails,
          currentGrade: acquiredPoints,
          totalPointsPossible: possiblePoints
        } as ComputedClassItem;
      })
    );
  }
}
