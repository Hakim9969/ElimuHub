import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CourseResponseDto,
  CategoryResponseDto,
  Difficulty,
} from '../../models/course.model';
import { AuthService } from './auth.service'; // Correct local import

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
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  // === Public Fetching ===

  getCourses(): Observable<CourseResponseDto[]> {
    return this.http.get<CourseResponseDto[]>(`${this.apiUrl}/courses`);
  }

  getCourseById(id: string): Observable<CourseResponseDto> {
    return this.http.get<CourseResponseDto>(`${this.apiUrl}/courses/${id}`);
  }

  getCoursesWithPagination(page: number = 1, limit: number = 10): Observable<ApiResponse<CourseResponseDto[]>> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    return this.http.get<ApiResponse<CourseResponseDto[]>>(`${this.apiUrl}/courses`, { params });
  }

  getFilteredCourses(search: string = '', difficulty: string = ''): Observable<CourseResponseDto[]> {
    return this.getCoursesWithFilters({ search, difficulty });
  }

  getCoursesWithFilters(filters: CourseFilters): Observable<CourseResponseDto[]> {
    let params = new HttpParams();
    if (filters.search?.trim()) params = params.set('search', filters.search.trim());
    if (filters.difficulty) params = params.set('difficulty', filters.difficulty);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.instructor?.trim()) params = params.set('instructor', filters.instructor.trim());
    if (filters.isNew !== undefined) params = params.set('isNew', filters.isNew.toString());
    if (filters.page && filters.page > 0) params = params.set('page', filters.page.toString());
    if (filters.limit && filters.limit > 0) params = params.set('limit', filters.limit.toString());

    return this.http.get<CourseResponseDto[]>(`${this.apiUrl}/courses`, { params });
  }

  getCoursesWithFiltersAndPagination(filters: CourseFilters): Observable<ApiResponse<CourseResponseDto[]>> {
    let params = new HttpParams();
    if (filters.search?.trim()) params = params.set('search', filters.search.trim());
    if (filters.difficulty) params = params.set('difficulty', filters.difficulty);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.instructor?.trim()) params = params.set('instructor', filters.instructor.trim());
    if (filters.isNew !== undefined) params = params.set('isNew', filters.isNew.toString());

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
    params = params.set('page', page.toString()).set('limit', limit.toString());

    return this.http.get<ApiResponse<CourseResponseDto[]>>(`${this.apiUrl}/courses`, { params });
  }

  // === Category & Difficulty ===

  getCategories(): Observable<CategoryResponseDto[]> {
    return this.http.get<CategoryResponseDto[]>(`${this.apiUrl}/categories`);
  }

  getDifficulties(): Difficulty[] {
    return Object.values(Difficulty);
  }

  // === Filtering & Search ===

  searchCourses(query: string): Observable<CourseResponseDto[]> {
    if (!query?.trim()) return this.getCourses();
    const params = new HttpParams().set('search', query.trim());
    return this.http.get<CourseResponseDto[]>(`${this.apiUrl}/courses/search`, { params });
  }

  getCoursesByDifficulty(difficulty: Difficulty): Observable<CourseResponseDto[]> {
    return this.http.get<CourseResponseDto[]>(`${this.apiUrl}/courses/difficulty/${difficulty}`);
  }

  getCoursesByCategory(category: string): Observable<CourseResponseDto[]> {
    return this.http.get<CourseResponseDto[]>(`${this.apiUrl}/courses/category/${category}`);
  }

  getNewCourses(): Observable<CourseResponseDto[]> {
    const params = new HttpParams().set('isNew', 'true');
    return this.http.get<CourseResponseDto[]>(`${this.apiUrl}/courses`, { params });
  }

  getFeaturedCourses(): Observable<CourseResponseDto[]> {
    return this.http.get<CourseResponseDto[]>(`${this.apiUrl}/courses/featured`);
  }

  // === Instructor-Specific (requires token) ===

  getMyCourses(): Observable<CourseResponseDto[]> {
    return this.http.get<CourseResponseDto[]>(`${this.apiUrl}/courses/my`, this.getAuthHeaders());
  }

  // === CRUD Operations (requires token) ===

  createCourse(courseData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/courses`, courseData, this.getAuthHeaders());
  }

  updateCourse(courseId: string, updateData: Partial<CourseResponseDto>): Observable<CourseResponseDto> {
    return this.http.patch<CourseResponseDto>(`${this.apiUrl}/courses/${courseId}`, updateData, this.getAuthHeaders());
  }


  addModule(courseId: string, moduleData: { title: string; order: number }) {
    const url = `${this.apiUrl}/courses/${courseId}/contents`;
    return this.http.post(url, moduleData, this.getAuthHeaders()); 
  }

  deleteCourse(id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/courses/${id}`);
}

deleteCategory(name: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/courses/category/${encodeURIComponent(name)}`);
}

}
