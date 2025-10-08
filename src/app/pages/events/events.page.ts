import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Event } from 'src/app/models/event';
import { EventsService } from 'src/app/services/events';
@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  standalone: false,
})
export class EventsPage implements OnInit {
  events: Event[] = []

  constructor(private eventsService: EventsService, private router: Router) { }

  goToAddEvent() {
    this.router.navigate(['/add-events'])
  }

  finalize(id: number) {
    this.eventsService.delete(id);
    this.events = this.eventsService.getAll()
  }

  getDetail(id: number) {
    this.router.navigate(['/event-detail', id]);
  }
  ngOnInit() {
    this.events = this.eventsService.getAll();
  }

}
