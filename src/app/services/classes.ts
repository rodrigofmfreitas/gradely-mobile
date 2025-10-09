import { Injectable } from '@angular/core';
import { ClassEnrolled } from '../models/class-enrolled';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  private classes: ClassEnrolled[] = [
    { id: 1, name: 'Desenvolvimento Mobile', course: 'Computer Science' }
  ]
  private nextId = 2;

  getAll(): ClassEnrolled[] {
    return this.classes;
  }

  getById(id: number) {
    return this.classes.find(c => c.id === id);
  }

  add(classData: Omit<ClassEnrolled, 'id'>) {
    const newClass = { id: this.nextId++, ...classData};
    this.classes.push(newClass);
  }

  delete(id: number) {
    this.classes = this.classes.filter(c => c.id !== id);
  }
}
