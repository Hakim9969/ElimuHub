import { Routes } from '@angular/router';
import { InstructorDashboardComponent } from './features/instructor/dashboard/instructor-dashboard.component/instructor-dashboard.component';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'instructor/dashboard', 
    pathMatch: 'full' 
  },
  { 
    path: 'instructor/dashboard', 
    component: InstructorDashboardComponent 
  },
  { 
    path: '**', 
    redirectTo: 'instructor/dashboard', 
    pathMatch: 'full' 
  }
];
