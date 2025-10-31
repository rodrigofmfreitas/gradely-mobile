import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EventsPageRoutingModule } from './events-routing.module';

// 1. CORREÇÃO: O nome da sua classe é 'EventosPage'
import { EventosPage } from './events.page';

// 2. CORREÇÃO: Importe o FullCalendarModule aqui
import { FullCalendarModule } from '@fullcalendar/angular';

// 3. CORREÇÃO: Remova todas as importações de plugins e a chamada 'registerPlugins'
// Elas não são mais necessárias neste arquivo no FullCalendar v6

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventsPageRoutingModule,
    FullCalendarModule // 4. CORREÇÃO: Adicione o FullCalendarModule aos imports
  ],
  // 5. CORREÇÃO: Declare o nome correto da classe
  declarations: [EventosPage]
})
export class EventosPageModule {}
