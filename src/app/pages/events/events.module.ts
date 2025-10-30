import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EventsPageRoutingModule } from './events-routing.module';
import { EventsPage } from './events.page';

import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    EventsPageRoutingModule,
    FormsModule
  ],
  declarations: [EventsPage]
})
export class EventsPageModule {}
