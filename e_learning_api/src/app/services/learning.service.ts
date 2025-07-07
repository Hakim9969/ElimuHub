import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {CourseResponseDto, LessonDto, ModuleDto} from '../../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class LearningService {
  private currentCourseSubject = new BehaviorSubject<CourseResponseDto | null>(null);
  private currentModuleSubject = new BehaviorSubject<ModuleDto | null>(null);
  private currentLessonSubject = new BehaviorSubject<LessonDto | null>(null);
  private progressSubject = new BehaviorSubject<{[key: string]: boolean}>({});

  public currentCourse$ = this.currentCourseSubject.asObservable();
  public currentModule$ = this.currentModuleSubject.asObservable();
  public currentLesson$ = this.currentLessonSubject.asObservable();
  public progress$ = this.progressSubject.asObservable();

  setCourse(course: CourseResponseDto): void {
    this.currentCourseSubject.next(course);
    // Set first module as current
    if (course.modules.length > 0) {
      this.setCurrentModule(course.modules[0]);
    }
  }

  setCurrentModule(module: ModuleDto): void {
    this.currentModuleSubject.next(module);
    // Set first lesson as current
    if (module.lessons.length > 0) {
      this.setCurrentLesson(module.lessons[0]);
    }
  }

  setCurrentLesson(lesson: LessonDto): void {
    this.currentLessonSubject.next(lesson);
  }

  markLessonCompleted(lessonId: string): void {
    const progress = this.progressSubject.value;
    progress[lessonId] = true;
    this.progressSubject.next(progress);
  }

  isLessonCompleted(lessonId: string): boolean {
    return this.progressSubject.value[lessonId] || false;
  }

  getNextModule(): ModuleDto | null {
    const course = this.currentCourseSubject.value;
    const currentModule = this.currentModuleSubject.value;

    if (!course || !currentModule) return null;

    const currentIndex = course.modules.findIndex(m => m.id === currentModule.id);
    return currentIndex < course.modules.length - 1 ? course.modules[currentIndex + 1] : null;
  }
}
