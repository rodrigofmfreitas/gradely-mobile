import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from 'src/app/models/event';
import { EventsService } from 'src/app/services/events';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
  standalone: false
})
export class EventDetailPage implements OnInit {
  eventData?: Event;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventsService
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventData = this.eventService.getById(id);
  }

}
