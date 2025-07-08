import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseResponseDto, CategoryResponseDto, Difficulty } from '../../models/course.model';
import { environment } from '../../environments/environment';

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

  constructor(private http: HttpClient) {}

  /**
   * Fetch all published courses (public)
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

  /**
   * Fetch courses created by the logged-in instructor
   */
  getMyCourses(): Observable<CourseResponseDto[]> {
    return this.http.get<CourseResponseDto[]>(`${this.apiUrl}/courses/my`);
  }

  /**
   * Update a course (e.g., publish/unpublish or edit)
   */
  updateCourse(courseId: string, updateData: Partial<CourseResponseDto>): Observable<CourseResponseDto> {
    return this.http.patch<CourseResponseDto>(`${this.apiUrl}/courses/${courseId}`, updateData);
  }

  /**
   * Create a new course
   */
  createCourse(courseData: Partial<CourseResponseDto>): Observable<CourseResponseDto> {
    return this.http.post<CourseResponseDto>(`${this.apiUrl}/courses`, courseData);
  }

  /**
   * Delete a course by ID
   */
  deleteCourse(courseId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/courses/${courseId}`);
  }
}
