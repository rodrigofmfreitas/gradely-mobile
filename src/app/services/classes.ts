import { Injectable } from '@angular/core';
import { Class } from '../models/class';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  private classes: Class[] = [
    { id: 1, name: 'Desenvolvimento Mobile', course: 'Computer Science' }
  ]
  private nextId = 2;

  getAll(): Class[] {
    return this.classes;
  }

  getById(id: number) {
    return this.classes.find(c => c.id === id);
  }

  add(classData: Omit<Class, 'id'>) {
    const newClass = { id: this.nextId++, ...classData};
    this.classes.push(newClass);
  }

  delete(id: number) {
    this.classes = this.classes.filter(c => c.id !== id);
  }
}
