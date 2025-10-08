import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from 'src/app/services/events';

@Component({
  selector: 'app-add-events',
  templateUrl: './add-events.page.html',
  styleUrls: ['./add-events.page.scss'],
  standalone: false,
})
export class AddEventsPage implements OnInit {
  name = "";
  class = "";
  type = "";

  constructor(private eventService: EventsService, private router: Router) { }

  addEvent() {
    if (this.name.trim() && this.class.trim() && this.type.trim()) {
      this.eventService.add( {
        name: this.name,
        class: this.class,
        type: this.class
      })
    }
    this.router.navigate(['/events']);
  }
  ngOnInit() {
  }

}
