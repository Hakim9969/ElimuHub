import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleListComponent } from '../module-list/module-list.component';
import { LessonViewerComponent } from '../lesson-viewer/lesson-viewer.component';
import { NextModuleButtonComponent } from '../next-module-button/next-module-button.component';
import { CourseResponseDto, LessonDto } from '../../../models/course.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course-service';
import { LearningService } from '../../services/learning.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-learning-platform',
  standalone: true,
  imports: [
    CommonModule,
    ModuleListComponent,
    LessonViewerComponent,
    NextModuleButtonComponent
  ],
  templateUrl: './learning-platform.component.html',
  styleUrls: ['./learning-platform.component.css']
})
export class LearningPlatformComponent implements OnInit {
  course: CourseResponseDto | null = null;
  currentLesson: LessonDto | null = null;
  error: string | null = null;
  progressPercentage = 0;
  showNextModuleButton = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private learningService: LearningService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.error = 'User not authenticated';
      this.router.navigate(['/login']);
      return;
    }

    this.loadCourse();
    this.setupSubscriptions();
  }

  private setupSubscriptions() {
    this.learningService.currentCourse$.subscribe(course => {
      this.course = course;
      this.calculateProgress();
    });

    this.learningService.currentLesson$.subscribe(lesson => {
      this.currentLesson = lesson;
      this.checkShowNextModuleButton();
    });

    this.learningService.progress$.subscribe(() => {
      this.calculateProgress();
      this.checkShowNextModuleButton();
    });
  }

  protected loadCourse() {
    const courseId = this.route.snapshot.paramMap.get('courseId');
    if (!courseId) {
      this.error = 'Course ID not found';
      console.error(`No courseId found in route parameters , ${courseId}`);
      return;
    }

    this.courseService.getCourseById(courseId).subscribe({
      next: (course) => {
        if (!course.contents || course.contents.length === 0) {
          this.error = 'Course has no.contents available';
          console.warn(`Course ${courseId} loaded but has no.contents`, course);
          return;
        }
        this.course = course;
        this.learningService.setCourse(this.course);
        this.error = null;
        console.log('Course loaded successfully:', course);
      },
      error: (err) => {
        this.error = 'Failed to load course. Please try again.';
        console.error('Error loading course:', err);
      }
    });
  }

  private calculateProgress() {
    if (!this.course || !this.course.contents) {
      this.progressPercentage = 0;
      return;
    }

    const totalLessons = this.course.contents.reduce((total, module) => total + (module.lessons?.length || 0), 0);
    const completedLessons = this.course.contents.reduce((total, module) => {
      return total + (module.lessons?.filter(lesson => this.learningService.isLessonCompleted(lesson.id)).length || 0);
    }, 0);

    this.progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  }

  private checkShowNextModuleButton() {
    if (!this.course || !this.currentLesson) {
      this.showNextModuleButton = false;
      return;
    }

    const currentModule = this.course.contents.find(m =>
      m.lessons.some(l => l.id === this.currentLesson?.id)
    );

    if (!currentModule) {
      this.showNextModuleButton = false;
      return;
    }

    const allLessonsCompleted = currentModule.lessons.every(lesson =>
      this.learningService.isLessonCompleted(lesson.id)
    );

    this.showNextModuleButton = allLessonsCompleted && !!this.learningService.getNextModule();
  }

  goBack() {
    this.router.navigate(['/courses']);
  }
}
