import { Component } from '@angular/core';
import { IonHeader } from "@ionic/angular/standalone";

@Component({
  selector: 'app-events',
  templateUrl: 'events.page.html',
  styleUrls: ['events.page.scss'],
  standalone:false
})
export class EventosPage { // Nome da classe atualizado

  // Esta é a configuração do seu gráfico
  public chartOptions: any; // Você pode usar 'any' ou a interface ChartOptions

  constructor() {
    this.chartOptions = {
      // 1. OS DADOS (SÉRIES)
      series: [
        {
          name: 'Tarefas', // Nome da série
          data: [
            // Cada objeto aqui é uma barra no gráfico
            {
              // 'x' é o nome da linha (o nome da pessoa)
              x: 'Neneng Sukema',
              // 'y' são as datas de início e fim
              y: [
                new Date('2021-06-15T08:30:00').getTime(), // Início
                new Date('2021-06-15T17:30:00').getTime()  // Fim
              ]
            },
            {
              x: 'Abdul Aziz',
              y: [
                new Date('2021-06-15T09:30:00').getTime(),
                new Date('2021-06-15T18:30:00').getTime()
              ]
            },
            {
              x: 'Cecen Nurheni',
              y: [
                new Date('2021-06-15T10:30:00').getTime(),
                new Date('2021-06-15T22:30:00').getTime() // 12 horas
              ]
            }
            // Adicione os outros (Rojak Suganda, Dadang Gongsir) aqui...
          ]
        }
      ],
      // 2. O TIPO DE GRÁFICO
      chart: {
        type: 'rangeBar', // <-- ISSO CRIA O GRÁFICO DE GANTT/TIMELINE
        height: 350
      },
      // 3. OPÇÕES DE VISUALIZAÇÃO
      plotOptions: {
        bar: {
          horizontal: true, // Barras horizontais
          borderRadius: 8 // Bordas arredondadas (como na imagem)
        }
      },
      // 4. EIXO X (AS DATAS/HORAS)
      xaxis: {
        type: 'datetime' // O eixo X é baseado em tempo
      },
      // 5. EIXO Y (OS NOMES)
      yaxis: {
        // O ApexCharts vai usar os nomes do 'x' nos dados automaticamente
      },
      // 6. ESTILO (ex: gradiente)
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100]
        }
      },
      dataLabels: {
        enabled: false // Esconde os rótulos dentro das barras
      }
    };
  }
}

