import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
})
export class EventosPage {

  calendarOptions: CalendarOptions = {
    // === CONFIGURAÇÃO PRINCIPAL ===
    initialView: 'resourceTimelineDay', // A visão que você quer!
    plugins: [ 'resourceTimeline' ], // Garante que o plugin está carregado
    headerToolbar: false, // Remove o cabeçalho padrão (Hoje, <, >)

    // === EIXO DE TEMPO (COLUNAS) ===
    slotMinTime: '08:00:00', // Horário de início
    slotMaxTime: '18:00:00', // Horário de término
    slotDuration: '00:15:00', // Intervalo de 15 min
    // Mostra os textos "9:00", "10:15" etc.
    slotLabelFormat: {
      hour: 'numeric',
      minute: '2-digit',
      omitZeroMinute: false,
      meridiem: false // 'false' para formato 24h
    },

    // === EIXO DE DISCIPLINAS (LINHAS) ===
    resources: [
      { id: 'multi', title: 'Multidisciplinar' },
      { id: 'disc1', title: 'Disciplina 1' },
      { id: 'disc2', title: 'Disciplina 2' },
      { id: 'disc3', title: 'Disciplina 3' }
    ],

    // === SEUS EVENTOS ===
    // Seus dados de eventos precisam ser mapeados para este formato.
    // O 'resourceId' conecta o evento à disciplina.
    events: [
      {
        title: 'Palestra',
        resourceId: 'multi', // Conecta com "Multidisciplinar"
        start: '2025-10-30T09:30:00', // Use data e hora completas
        end: '2025-10-30T11:00:00',
        color: '#FF5733' // Cor laranja
      },
      {
        title: 'Trabalho',
        resourceId: 'disc1',
        start: '2025-10-30T10:30:00',
        end: '2025-10-30T12:00:00',
        color: '#337DFF' // Cor azul
      },
      {
        title: 'Prova',
        resourceId: 'disc2',
        start: '2025-10-30T11:30:00',
        end: '2025-10-30T12:30:00',
        color: '#33FF57' // Cor verde (exemplo)
      }
      // ... adicione mais eventos
    ]
  };

  constructor() { }

}
