import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CourseResponseDto, CategoryResponseDto, Difficulty } from '../../models/course.model';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import {Lesson, Module} from '../features/module-list/module-list.component';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  /**
   * Fetch all courses from the backend
   */
  getCourses(): Observable<CourseResponseDto[]> {
    return this.http.get<CourseResponseDto[]>(`${this.apiUrl}/courses`);
  }

  /**
   * Fetch courses with pagination
   */
  getCoursesWithPagination(page: number = 1, limit: number = 10): Observable<ApiResponse<CourseResponseDto[]>> {
    return this.http.get<ApiResponse<CourseResponseDto[]>>(`${this.apiUrl}/courses?page=${page}&limit=${limit}`);
  }

  /**
   * Fetch course by ID
   */
  getCourseById(id: string): Observable<CourseResponseDto> {
    return this.http.get<CourseResponseDto>(`${this.apiUrl}/courses/${id}`);
  }

  /**
   * Fetch courses by category
   */
  getCoursesByCategory(category: string): Observable<CourseResponseDto[]> {
    return this.http.get<CourseResponseDto[]>(`${this.apiUrl}/courses/category/${category}`);
  }

  /**
   * Fetch featured courses
   */
  getFeaturedCourses(): Observable<CourseResponseDto[]> {
    return this.http.get<CourseResponseDto[]>(`${this.apiUrl}/courses/featured`);
  }

  /**
   * Fetch all categories
   */
  getCategories(): Observable<CategoryResponseDto[]> {
    return this.http.get<CategoryResponseDto[]>(`${this.apiUrl}/courses/categories`);
  }

  /**
   * Search courses by title or description
   */
  searchCourses(query: string): Observable<CourseResponseDto[]> {
    return this.http.get<CourseResponseDto[]>(`${this.apiUrl}/courses/search?q=${encodeURIComponent(query)}`);
  }

  /**
   * Get courses by difficulty level
   */
  getCoursesByDifficulty(difficulty: Difficulty): Observable<CourseResponseDto[]> {
    return this.http.get<CourseResponseDto[]>(`${this.apiUrl}/courses/difficulty/${difficulty}`);
  }



  private completedLessonsSubject = new BehaviorSubject<Set<number>>(new Set());
  private selectedModuleSubject = new BehaviorSubject<number | null>(null);
  private selectedLessonSubject = new BehaviorSubject<Lesson | null>(null);

  completedLessons$ = this.completedLessonsSubject.asObservable();
  selectedModule$ = this.selectedModuleSubject.asObservable();
  selectedLesson$ = this.selectedLessonSubject.asObservable();

  private courseData = {
    title: "Artificial Intelligence & Machine Learning",
    instructor: "Simon Shaw, Illustrator and 3D designer",
    modules: [
      {
        id: 1,
        title: "Introduction",
        lessons: [
          {
            id: 1,
            title: "L1 Presentation",
            completed: false,
            content: "Welcome to AI & Machine Learning! This course will introduce you to the fundamental concepts of artificial intelligence and machine learning.",
            quiz: {
              question: "What does AI stand for?",
              options: ["Artificial Intelligence", "Automated Intelligence", "Advanced Intelligence"],
              correct: 0
            }
          },
          {
            id: 2,
            title: "L2 Job opportunities",
            completed: false,
            content: "AI and ML offer numerous career opportunities including Data Scientist, ML Engineer, AI Researcher, and more.",
            quiz: {
              question: "Which role focuses on building ML models?",
              options: ["Data Analyst", "ML Engineer", "Product Manager"],
              correct: 1
            }
          },
          {
            id: 3,
            title: "L3 How to get the most out of this course",
            completed: false,
            content: "To maximize your learning: practice coding, complete all exercises, join discussions, and build projects.",
            quiz: {
              question: "What's the best way to learn programming?",
              options: ["Just reading", "Practice coding", "Watching videos only"],
              correct: 1
            }
          }
        ]
      },
      {
        id: 2,
        title: "Learn Manufacturing",
        lessons: [
          {
            id: 4,
            title: "L4 Spontaneous charts",
            completed: false,
            content: "Learn how to create dynamic charts and visualizations for manufacturing data analysis.",
            quiz: {
              question: "What type of chart is best for trends?",
              options: ["Pie Chart", "Line Chart", "Bar Chart"],
              correct: 1
            }
          },
          {
            id: 5,
            title: "L5 Deformers",
            completed: false,
            content: "Understanding deformers in 3D modeling and their applications in manufacturing processes.",
            quiz: {
              question: "Deformers are used for?",
              options: ["Static models", "Dynamic modifications", "Color changes"],
              correct: 1
            }
          },
          {
            id: 6,
            title: "L6 Magraph (cloner)",
            completed: false,
            content: "Master the cloner tool for creating complex manufacturing patterns and repetitive structures.",
            quiz: {
              question: "Cloner tool is used for?",
              options: ["Single objects", "Repetitive patterns", "Color grading"],
              correct: 1
            }
          }
        ]
      },
      {
        id: 3,
        title: "Field Experience testing modules & investors!",
        lessons: [
          {
            id: 7,
            title: "L7 Interface and timeline",
            completed: false,
            content: "Navigate the interface effectively and understand project timelines for real-world applications.",
            quiz: {
              question: "Good interface design focuses on?",
              options: ["Complexity", "User experience", "More features"],
              correct: 1
            }
          },
          {
            id: 8,
            title: "L8 Volume with vectors",
            completed: false,
            content: "Work with 3D volumes and vector mathematics in manufacturing contexts.",
            quiz: {
              question: "Vectors represent?",
              options: ["Colors", "Direction and magnitude", "Time"],
              correct: 1
            }
          },
          {
            id: 9,
            title: "L9 Symmetry connector",
            completed: false,
            content: "Implement symmetry connectors for balanced and efficient manufacturing designs.",
            quiz: {
              question: "Symmetry in design provides?",
              options: ["Complexity", "Balance and efficiency", "Random patterns"],
              correct: 1
            }
          }
        ]
      }
    ]
  };

  getCourseData() {
    return this.courseData;
  }

  getModules(): Module[] {
    return this.courseData.modules;
  }

  getModule(id: number): Module | undefined {
    return this.courseData.modules.find(module => module.id === id);
  }

  getLesson(moduleId: number, lessonId: number): Lesson | undefined {
    const module = this.getModule(moduleId);
    return module?.lessons.find(lesson => lesson.id === lessonId);
  }

  selectModule(moduleId: number | null): void {
    this.selectedModuleSubject.next(moduleId);
  }

  selectLesson(lesson: Lesson | null): void {
    this.selectedLessonSubject.next(lesson);
  }

  completeLesson(lessonId: number): void {
    const currentCompleted = this.completedLessonsSubject.value;
    const newCompleted = new Set(currentCompleted);
    newCompleted.add(lessonId);
    this.completedLessonsSubject.next(newCompleted);
  }

  isLessonCompleted(lessonId: number): boolean {
    return this.completedLessonsSubject.value.has(lessonId);
  }

  getCompletedLessons(): Set<number> {
    return this.completedLessonsSubject.value;
  }

  getModuleProgress(moduleId: number): { completed: number; total: number } {
    const module = this.getModule(moduleId);
    if (!module) return { completed: 0, total: 0 };

    const completedCount = module.lessons.filter(lesson =>
      this.isLessonCompleted(lesson.id)
    ).length;

    return {
      completed: completedCount,
      total: module.lessons.length
    };
  }

  getCourseProgress(): { completed: number; total: number } {
    const totalLessons = this.courseData.modules.reduce((total, module) =>
      total + module.lessons.length, 0
    );

    return {
      completed: this.completedLessonsSubject.value.size,
      total: totalLessons
    };
  }

  getNextModule(currentModuleId: number): Module | null {
    const currentIndex = this.courseData.modules.findIndex(m => m.id === currentModuleId);
    if (currentIndex >= 0 && currentIndex < this.courseData.modules.length - 1) {
      return this.courseData.modules[currentIndex + 1];
    }
    return null;
  }

  isModuleCompleted(moduleId: number): boolean {
    const progress = this.getModuleProgress(moduleId);
    return progress.completed === progress.total && progress.total > 0;
  }
}
