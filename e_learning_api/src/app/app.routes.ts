import {Routes} from '@angular/router';
import {LandingComponent} from './features/landing/landing.component';
import {AuthComponent} from './core/auth/auth.component';
import { CoursesComponent } from './features/courses/courses.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard.component';
import { AdminAuthGuard } from './core/guards/admin-auth.guard';

export const routes: Routes = [
  {path: '', component: LandingComponent},
  {
  path: 'admin',
  canActivate: [AdminAuthGuard],
  loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  { path: 'courses', component: CoursesComponent },

  {path: 'login', component: AuthComponent, data: {mode: 'login'}},
  {path: 'register', component: AuthComponent, data: {mode: 'register'}},
  {path: 'forgot-password', component: AuthComponent, data: {mode: 'forgot-password'}},
  {path: 'reset-password', component: AuthComponent, data: {mode: 'reset-password'}},
  {path: '**', redirectTo: ''}
];
