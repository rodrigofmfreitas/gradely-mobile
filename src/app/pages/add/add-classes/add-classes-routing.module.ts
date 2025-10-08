import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddClassesPage } from './add-classes.page';

const routes: Routes = [
  {
    path: '',
    component: AddClassesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddClassesPageRoutingModule {}
