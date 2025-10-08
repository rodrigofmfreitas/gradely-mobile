import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddClassesPageRoutingModule } from './add-classes-routing.module';

import { AddClassesPage } from './add-classes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddClassesPageRoutingModule
  ],
  declarations: [AddClassesPage]
})
export class AddClassesPageModule {}
