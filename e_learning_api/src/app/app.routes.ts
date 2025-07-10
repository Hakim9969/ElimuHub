import { CourseContentComponent } from './features/course-content/course-content.component';
import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';
import { AuthComponent } from './core/auth/auth.component';
import { CoursesComponent } from './features/courses/courses.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard.component';
import { LearningPlatformComponent } from './features/learning-platform/learning-platform.component';
import { MyCoursesComponent } from './features/my-courses/my-courses.component';
import { CourseDetailsComponent } from './features/courses-details/courses-details.component';
import { InstructorDashboardComponent } from './features/instructor/dashboard/instructor-dashboard.component';
import { LessonManagerComponent } from './features/lesson-manager/lesson-manager.component';
import { QuizBuilderComponent } from './features/quiz-builder/quiz-builder.component';


export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'instructor', component: InstructorDashboardComponent },
  {
    path: 'instructor/course/:courseId/contents', component: CourseContentComponent
  },

  {
    path: 'instructor/course/:courseId/content/:contentId/lessons',
    component: LessonManagerComponent
  },

{
  path: 'instructor/course/:courseId/quiz',
  component: QuizBuilderComponent
},


  { path: 'courses', component: CoursesComponent },
  { path: 'enroll/learn/:courseId', component: LearningPlatformComponent },
  { path: 'enroll/my-courses', component: MyCoursesComponent },
  { path: 'course-details/:courseId', component: CourseDetailsComponent },


  { path: 'login', component: AuthComponent, data: { mode: 'login' } },
  { path: 'register', component: AuthComponent, data: { mode: 'register' } },
  { path: 'forgot-password', component: AuthComponent, data: { mode: 'forgot-password' } },
  { path: 'reset-password', component: AuthComponent, data: { mode: 'reset-password' } },
  { path: '**', redirectTo: '' }
];