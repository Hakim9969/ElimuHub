import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class QuizService {
    constructor(private http: HttpClient) { }

    createQuiz(data: any) {
        return this.http.post('http://localhost:3000/quiz', data);
    }

    getQuizByCourse(courseId: string) {
        return this.http.get(`http://localhost:3000/quiz/by-course/${courseId}`);
    }
}
