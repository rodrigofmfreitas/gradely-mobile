// src/app/services/classes.service.ts (FIXED)

import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, setDoc, updateDoc, query, where, collectionData, docData } from '@angular/fire/firestore';
import { AuthService } from './auth';
import { Observable, switchMap, filter, map, of } from 'rxjs';
import { User } from '@angular/fire/auth';
import { ClassItem, NewClassForm } from '../models/classModel';

// NOTE: The 'ComputedClassItem' interface and the 'getComputedClassDetails' method
// are REMOVED to break the circular dependency. The component handles this logic now.

@Injectable({
  providedIn: 'root'
})

export class ClassesService {
  private firestore = inject(Firestore);
  private auth = inject(AuthService);
  // private tasksService = inject(TasksService); // 🛑 REMOVED to break circular dependency

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

  // 🛑 The getComputedClassDetails method is DELETED
  // because it relied on TasksService, causing the circular dependency.
}
