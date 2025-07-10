import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

const API_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class LessonService {
  constructor(private http: HttpClient) {}

  getLessons(contentId: string) {
    return this.http.get<any[]>(`${API_URL}/contents/${contentId}/lessons`);
  }

  addLesson(contentId: string, lesson: {
    title: string;
    type: 'VIDEO' | 'PDF' | 'TEXT' | 'LINK';
    contentUrl?: string;
    content?: string;
  }) {
    return this.http.post(`${API_URL}/contents/${contentId}/lessons`, lesson);
  }
}
