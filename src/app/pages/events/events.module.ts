import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EventsPageRoutingModule } from './events-routing.module';
import { EventosPage } from './events.page';
import { NgApexchartsModule } from 'ng-apexcharts';


import { FullCalendarModule } from '@fullcalendar/angular';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventsPageRoutingModule,
    FullCalendarModule,
    NgApexchartsModule
  ],

  declarations: [EventosPage]
})
export class EventosPageModule {}


