import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full'
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'classes',
    loadChildren: () => import('./pages/classes/classes.module').then( m => m.ClassesPageModule)
  },
  {
    path: 'events',
    loadChildren: () => import('./pages/events/events.module').then( m => m.EventsPageModule)
  },
  {
    path: 'add-classes',
    loadChildren: () => import('./pages/add-classes/add-classes.module').then( m => m.AddClassesPageModule)
  },
  {
    path: 'add-events',
    loadChildren: () => import('./pages/add-events/add-events.module').then( m => m.AddEventsPageModule)
  },
  {
    path: 'class-detail/:id',
    loadChildren: () => import('./pages/class-detail/class-detail.module').then( m => m.ClassDetailPageModule)
  },
  {
    path: 'event-detail/:id',
    loadChildren: () => import('./pages/event-detail/event-detail.module').then( m => m.EventDetailPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
