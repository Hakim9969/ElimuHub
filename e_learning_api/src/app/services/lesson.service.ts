import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class LessonService {
  constructor(private http: HttpClient) {}

  getLessons(contentId: string) {
    return this.http.get<any[]>(`/api/contents/${contentId}/lessons`);
  }

  addLesson(contentId: string, lesson: { title: string; description: string }) {
    return this.http.post(`/api/contents/${contentId}/lessons`, lesson);
  }
}
