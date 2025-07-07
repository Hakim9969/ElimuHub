import {Routes} from '@angular/router';
import {LandingComponent} from './features/landing/landing.component';
import {AuthComponent} from './core/auth/auth.component';

export const routes: Routes = [
  {path: '', component: LandingComponent},

  {path: 'login', component: AuthComponent, data: {mode: 'login'}},
  {path: 'register', component: AuthComponent, data: {mode: 'register'}},
  {path: 'forgot-password', component: AuthComponent, data: {mode: 'forgot-password'}},
  {path: 'reset-password', component: AuthComponent, data: {mode: 'reset-password'}},
  {path: '**', redirectTo: ''}
];
