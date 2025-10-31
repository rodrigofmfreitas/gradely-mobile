import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';

// 1. CORREÇÃO: Importe o plugin AQUI
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import { IonHeader } from "@ionic/angular/standalone";

@Component({
  selector: 'app-eventos',
  // 2. CORREÇÃO: Seus arquivos se chamam 'events.page.html' e 'events.page.scss'
  // (e não 'eventos.page.html' / 'eventos.page.scss')
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  standalone: false
})
export class EventosPage {

  calendarOptions: CalendarOptions = {
    initialView: 'resourceTimelineDay',

    // 3. CORREÇÃO: Passe o OBJETO do plugin, não uma string
    plugins: [ resourceTimelinePlugin ],

    headerToolbar: false,
    slotMinTime: '08:00:00',
    slotMaxTime: '18:00:00',

    // Seus dados (mantidos como estavam)
    resources: [
      { id: 'multi', title: 'Multidisciplinar' },
      { id: 'disc1', title: 'Disciplina 1' },
      { id: 'disc2', title: 'Disciplina 2' },
      { id: 'disc3', title: 'Disciplina 3' }
    ],
    events: [
      {
        title: 'Palestra',
        resourceId: 'multi',
        start: '2025-10-30T09:30:00',
        end: '2025-10-30T11:00:00',
        color: '#FF5733'
      },
      {
        title: 'Trabalho',
        resourceId: 'disc1',
        start: '2025-10-30T10:30:00',
        end: '2025-10-30T12:00:00',
        color: '#337DFF'
      }
    ]
  };

  constructor() { }
}
