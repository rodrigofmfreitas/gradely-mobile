
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EventsPageRoutingModule } from './events-routing.module';
import { EventsPage } from './events.page';

import { FormsModule } from '@angular/forms';

import { FullCalendarModule } from '@fullcalendar/angular';
import { resourceTimelinePlugin } from '@fullcalendar/resource-timeline';
import { dayGridPlugin } from '@fullcalendar/daygrid';
import { timeGridPlugin } from '@fullcalendar/timegrid';

FullCalendarModule.registerPlugins([
  resourceTimelinePlugin,
  dayGridPlugin,
  timeGridPlugin
]);

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    EventsPageRoutingModule,
    FormsModule,
    FullCalendarModule
  ],
  declarations: [EventsPage]
})
export class EventsPageModule {}
