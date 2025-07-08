import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CourseResponseDto, CategoryResponseDto, Difficulty} from '../../models/course.model';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface CourseFilters {
  search?: string;
  difficulty?: string;
  category?: string;
  instructor?: string;
  isNew?: boolean;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {
  }

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
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ApiResponse<CourseResponseDto[]>>(`${this.apiUrl}/courses`, {params});
  }

  /**
   * Fetch course by ID
   */
  getCourseById(id: string): Observable<CourseResponseDto> {
    return this.http.get<CourseResponseDto>(`${this.apiUrl}/courses/${id}`);
  }

  /**
   * Get courses filtered by search and/or difficulty (legacy method for backwards compatibility)
   */
  getFilteredCourses(search: string = '', difficulty: string = ''): Observable<CourseResponseDto[]> {
    return this.getCoursesWithFilters({search, difficulty});
  }

  /**
   * Get courses with comprehensive filtering options
   */
  getCoursesWithFilters(filters: CourseFilters): Observable<CourseResponseDto[]> {
    let params = new HttpParams();

    // Add search parameter
    if (filters.search && filters.search.trim()) {
      params = params.set('search', filters.search.trim());
    }

    // Add difficulty filter
    if (filters.difficulty && filters.difficulty !== '') {
      params = params.set('difficulty', filters.difficulty);
    }

    // Add category filter
    if (filters.category && filters.category !== '') {
      params = params.set('category', filters.category);
    }

    // Add instructor filter
    if (filters.instructor && filters.instructor.trim()) {
      params = params.set('instructor', filters.instructor.trim());
    }

    // Add new courses filter
    if (filters.isNew !== undefined) {
      params = params.set('isNew', filters.isNew.toString());
    }

    // Add pagination
    if (filters.page !== undefined && filters.page > 0) {
      params = params.set('page', filters.page.toString());
    }

    if (filters.limit !== undefined && filters.limit > 0) {
      params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<CourseResponseDto[]>(`${this.apiUrl}/courses`, {params});
  }

  /**
   * Get courses with comprehensive filtering and pagination response
   */
  getCoursesWithFiltersAndPagination(filters: CourseFilters): Observable<ApiResponse<CourseResponseDto[]>> {
    let params = new HttpParams();

    // Add search parameter
    if (filters.search && filters.search.trim()) {
      params = params.set('search', filters.search.trim());
    }

    // Add difficulty filter
    if (filters.difficulty && filters.difficulty !== '') {
      params = params.set('difficulty', filters.difficulty);
    }

    // Add category filter
    if (filters.category && filters.category !== '') {
      params = params.set('category', filters.category);
    }

    // Add instructor filter
    if (filters.instructor && filters.instructor.trim()) {
      params = params.set('instructor', filters.instructor.trim());
    }

    // Add new courses filter
    if (filters.isNew !== undefined) {
      params = params.set('isNew', filters.isNew.toString());
    }

    // Add pagination (default values)
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    params = params.set('page', page.toString());
    params = params.set('limit', limit.toString());

    return this.http.get<ApiResponse<CourseResponseDto[]>>(`${this.apiUrl}/courses`, {params});
  }

  /**
   * Get all available categories for filtering
   */
  getCategories(): Observable<CategoryResponseDto[]> {
    return this.http.get<CategoryResponseDto[]>(`${this.apiUrl}/courses/categories`);
  }

  /**
   * Get all available difficulties as enum values
   */
  getDifficulties(): Difficulty[] {
    return Object.values(Difficulty);
  }

  /**
   * Search courses by title or description
   */
  searchCourses(query: string): Observable<CourseResponseDto[]> {
    if (!query || !query.trim()) {
      return this.getCourses();
    }

    const params = new HttpParams().set('search', query.trim());
    return this.http.get<CourseResponseDto[]>(`${this.apiUrl}/courses/search`, {params});
  }

  /**
   * Get courses by difficulty level
   */
  getCoursesByDifficulty(difficulty: Difficulty): Observable<CourseResponseDto[]> {
    const params = new HttpParams().set('difficulty', difficulty);
    return this.http.get<CourseResponseDto[]>(`${this.apiUrl}/courses`, {params});
  }


  /**
   * Get recently created courses (within last 30 days)
   */
  getNewCourses(): Observable<CourseResponseDto[]> {
    const params = new HttpParams().set('isNew', 'true');
    return this.http.get<CourseResponseDto[]>(`${this.apiUrl}/courses`, {params});
  }

  deleteCourse(id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/courses/${id}`);
}

deleteCategory(name: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/courses/category/${encodeURIComponent(name)}`);
}

}
