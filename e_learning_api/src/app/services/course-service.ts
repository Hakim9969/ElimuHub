import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CourseResponseDto, CategoryResponseDto, Difficulty } from '../../models/course.model';


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
    return this.http.get<CategoryResponseDto[]>(`${this.apiUrl}/categories`);
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
}