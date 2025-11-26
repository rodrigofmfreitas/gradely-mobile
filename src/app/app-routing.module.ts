import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';

const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate: [guestGuard]
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule),
    canActivate: [guestGuard]
  },
  {
    path: 'user-info',
    loadChildren: () => import('./pages/user-info/user-info.module').then( m => m.UserInfoPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [authGuard]
  },
  {
    path: 'classes',
    loadChildren: () => import('./pages/classes/classes.module').then( m => m.ClassesPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'events',
    loadChildren: () => import('./pages/events/events.module').then( m => m.EventosPageModule)
  },
  {
    path: 'add-classes',
    loadChildren: () => import('./pages/add/add-classes/add-classes.module').then( m => m.AddClassesPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'add-events',
    loadChildren: () => import('./pages/add/add-events/add-events.module').then( m => m.AddEventsPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'class-detail/:id',
    loadChildren: () => import('./pages/detail/class-detail/class-detail.module').then( m => m.ClassDetailPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'event-detail/:id',
    loadChildren: () => import('./pages/detail/event-detail/event-detail.module').then( m => m.EventDetailPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'tasks',
    loadChildren: () => import('./pages/tasks/tasks.module').then( m => m.TasksPageModule),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'profile' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
