import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class InstructorService {
  constructor(private http: HttpClient) {}

  getMyCourses() {
    return this.http.get<any[]>('/api/courses/my'); // Ensure backend returns an array
  }

  getQuizStats(id: string) {
    return this.http.get(`/api/quiz/${id}/stats`);
  }

  createCourse(data: any) {
    return this.http.post('/api/courses', data);
  }

  updateCourse(courseId: string, data: any) {
    return this.http.patch(`/api/courses/${courseId}`, data);
  }

  deleteCourse(courseId: string) {
    return this.http.delete(`/api/courses/${courseId}`);
  }
}
