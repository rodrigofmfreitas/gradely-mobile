import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // Para os 'ion-'
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';

import { NgChartsModule } from 'ng2-charts'; // Para o gráfico

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, // Import do Ionic
    DashboardPageRoutingModule,
    NgChartsModule // Import do Gráfico
  ],
  declarations: [DashboardPage]
})
export class DashboardPageModule {}
