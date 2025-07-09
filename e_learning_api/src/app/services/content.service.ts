import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.auth.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
  }

  getContents(courseId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/courses/${courseId}/contents`, this.getAuthHeaders());
  }

  createContent(courseId: string, contentData: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/courses/${courseId}/contents`,
      contentData,
      this.getAuthHeaders()
    );
  }
}
