import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {CourseResponseDto, LessonDto, ModuleDto} from '../../models/course.model';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

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


  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  setCourse(course: CourseResponseDto): void {
    this.currentCourseSubject.next(course);
    // Set first module as current
    if (course.contents.length > 0) {
      this.setCurrentModule(course.contents[0]);
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

    this.markLessonCompletedAPI(lessonId).subscribe({
      next: (response) => {
        console.log('Lesson marked as completed successfully:', response);
      },
      error: (error) => {
        console.error('Error marking lesson as completed:', error);
        // Optionally, you can revert the local progress on error
        const revertProgress = this.progressSubject.value;
        revertProgress[lessonId] = false;
        this.progressSubject.next(revertProgress);
      }
    });
  }

  private markLessonCompletedAPI(lessonId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/progress/lesson/${lessonId}/complete`, {});
  }


  loadProgress(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/progress/course/${courseId}`);
  }
  isLessonCompleted(lessonId: string): boolean {
    return this.progressSubject.value[lessonId] || false;
  }


  getNextModule(): ModuleDto | null {
    const course = this.currentCourseSubject.value;
    const currentModule = this.currentModuleSubject.value;

    if (!course || !currentModule) return null;

    const currentIndex = course.contents.findIndex(m => m.id === currentModule.id);
    return currentIndex < course.contents.length - 1 ? course.contents[currentIndex + 1] : null;
  }
}
