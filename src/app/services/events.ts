import { Injectable } from '@angular/core';
import { Event } from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private events: Event[] = [
      { id: 1, name: 'Prova 1', class: 'Desenvolvimento Mobile', type: 'Prova' }
    ]
    private nextId = 2;

    getAll(): Event[] {
      return this.events;
    }

    getById(id: number) {
      return this.events.find(e => e.id === id);
    }

    add(eventData: Omit<Event, 'id'>) {
      const newEvent = { id: this.nextId++, ...eventData};
      this.events.push(newEvent);
    }

    delete(id: number) {
      this.events = this.events.filter(e => e.id !== id);
    }
}
