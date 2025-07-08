import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';
import {CourseResponseDto} from '../../models/course.model';

export interface EnrollmentResponse {
  enrollmentId: string;
  courseId: string;
  enrolledAt: Date;
  course: CourseResponseDto;
  totalLessons: number;
  progress: number;
  progressPercentage: number;
  certificateIssued: boolean;
  certificateIssuedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
  }

  enrollUserInCourse(userId: string, courseId: string): Observable<EnrollmentResponse> {
    return this.http.post<EnrollmentResponse>(
      `${this.apiUrl}/enrollment/${courseId}/enroll`,
      {userId, courseId},
      this.getAuthHeaders()
    );
  }

  getUserEnrollments(): Observable<EnrollmentResponse[]> {
    return this.http.get<EnrollmentResponse[]>(`${this.apiUrl}/enrollment/me/dashboard`, this.getAuthHeaders());
  }

  unenrollUserFromCourse(userId: string, courseId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/enrollment/${courseId}/unenroll`, this.getAuthHeaders());
  }
}
