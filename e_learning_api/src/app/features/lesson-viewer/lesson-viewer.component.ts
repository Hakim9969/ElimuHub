import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {LearningService} from "../../services/learning.service";
import {LessonDto} from "../../../models/course.model";
import {QuizComponent} from "../quiz/quiz.component";

@Component({
  selector: 'app-lesson-viewer',
  standalone: true,
  imports: [CommonModule, QuizComponent],
  templateUrl: './lesson-viewer.component.html',
  styleUrl: './lesson-viewer.component.css'
})
export class LessonViewerComponent implements OnInit {
  currentLesson: LessonDto | null = null;
  showQuiz = false;
  isLessonCompleted = false;

  constructor(private learningService: LearningService) {}

  ngOnInit() {
    this.learningService.currentLesson$.subscribe(lesson => {
      this.currentLesson = lesson;
      this.showQuiz = false;
      this.isLessonCompleted = lesson ? this.learningService.isLessonCompleted(lesson.id) : false;
    });
  }

  startQuiz() {
    this.showQuiz = true;
  }

  onQuizCompleted(passed: boolean) {
    if (passed && this.currentLesson) {
      this.learningService.markLessonCompleted(this.currentLesson.id);
      this.isLessonCompleted = true;
    }
  }
}
