import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Event } from 'src/app/models/event'; // SEU MODELO REAL
import { EventsService } from 'src/app/services/events'; // SEU SERVIÇO REAL

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  dates: any[] = [];
  selectedDate: any;

  allEvents: Event[] = []; // Usando seu model Event
  filteredEvents: Event[] = []; // Usando seu model Event

  // MANTENDO as funções do seu arquivo original
  constructor(private eventsService: EventsService, private router: Router) { }

  ngOnInit() {
    this.generateDates(); // Cria a timeline horizontal
    this.loadEvents();    // Carrega os eventos
  }

  // Carrega os eventos REAIS do seu serviço
  loadEvents() {
    // Agora usamos seu serviço
    this.allEvents = this.eventsService.getAll();

    // Seleciona a data de "Hoje" e filtra os eventos
    if (this.dates.length > 0) {
      this.selectDate(this.dates[0]);
    }
  }

  // Filtra os eventos baseado na data selecionada
  selectDate(date: any) {
    this.selectedDate = date;

    // Lógica de filtro
    // Compara o dia, mês e ano, ignorando a hora
    this.filteredEvents = this.allEvents.filter(event => {
      // event.date é uma string, convertemos para Date
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === this.selectedDate.value.toDateString();
    });
  }

  // Função para a cor (compromisso, já que não vem do model)
  getEventColor(event: Event): string {
    // Simples lógica para variar a cor baseada no ID
    const id = event.id || 0;
    const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];
    return colors[id % colors.length];
  }

  // --- Funções que você já tinha ---
  goToAddEvent() {
    this.router.navigate(['/add-events']);
  }

  getDetail(id: number) {
    this.router.navigate(['/event-detail', id]);
  }

  // Função para finalizar (do seu arquivo original)
  finalize(id: number) {
    this.eventsService.delete(id);
    this.loadEvents(); // Recarrega os eventos
  }

  // --- Helper para criar a timeline ---
  generateDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.dates = [
      { label: 'Hoje', value: today },
      { label: 'Amanhã', value: tomorrow },
    ];

    // Adiciona os próximos 5 dias
    for (let i = 2; i < 7; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(nextDate.getDate() + i);

      const label = nextDate.toLocaleDateString('pt-BR', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit'
      }).replace('.', '');

      this.dates.push({ label: label, value: nextDate });
    }

    // Define "Hoje" como a data inicial selecionada
    if (this.dates.length > 0) {
      this.selectedDate = this.dates[0];
    }
  }
}
