import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';

const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'classes',
    loadChildren: () => import('./pages/classes/classes.module').then( m => m.ClassesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'events',
    loadChildren: () => import('./pages/events/events.module').then( m => m.EventsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'add-classes',
    loadChildren: () => import('./pages/add/add-classes/add-classes.module').then( m => m.AddClassesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'add-events',
    loadChildren: () => import('./pages/add/add-events/add-events.module').then( m => m.AddEventsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'class-detail/:id',
    loadChildren: () => import('./pages/detail/class-detail/class-detail.module').then( m => m.ClassDetailPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'event-detail/:id',
    loadChildren: () => import('./pages/detail/event-detail/event-detail.module').then( m => m.EventDetailPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tasks',
    loadChildren: () => import('./pages/tasks/tasks.module').then( m => m.TasksPageModule),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
