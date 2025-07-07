import {Routes} from '@angular/router';
import {LandingComponent} from './features/landing/landing.component';
import {AuthComponent} from './core/auth/auth.component';
import { CoursesComponent } from './features/courses/courses.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard.component';
import {LearningPlatformComponent} from './features/learning-platform/learning-platform.component';
import {MyCoursesComponent} from './features/my-courses/my-courses.component';

export const routes: Routes = [
  {path: '', component: LandingComponent},
   { path: 'admin', component: AdminDashboardComponent },
  { path: 'courses', component: CoursesComponent },
  {path: 'learn/:courseId', component: LearningPlatformComponent},
  { path: 'enroll/my-courses', component: MyCoursesComponent },


  {path: 'login', component: AuthComponent, data: {mode: 'login'}},
  {path: 'register', component: AuthComponent, data: {mode: 'register'}},
  {path: 'forgot-password', component: AuthComponent, data: {mode: 'forgot-password'}},
  {path: 'reset-password', component: AuthComponent, data: {mode: 'reset-password'}},
  {path: '**', redirectTo: ''}
];
