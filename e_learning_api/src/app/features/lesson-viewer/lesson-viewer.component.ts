import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {LearningService} from "../../services/learning.service";
import {LessonDto} from "../../../models/course.model";
import {QuizComponent} from "../quiz/quiz.component";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {FooterComponent} from "../shared/components/footer/footer.component";

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
  sanitizedPdfUrl!: SafeResourceUrl;

  constructor(private learningService: LearningService,private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.learningService.currentLesson$.subscribe(lesson => {
      this.currentLesson = lesson;
      this.showQuiz = false;
      this.isLessonCompleted = lesson ? this.learningService.isLessonCompleted(lesson.id) : false;
    });
    if (this.currentLesson?.type === 'PDF' && this.currentLesson?.contentUrl) {
      this.sanitizedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.currentLesson.contentUrl
      );
    }
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
  getSafeYoutubeUrl(url: string): SafeResourceUrl {
    const videoId = this.extractYoutubeVideoId(url);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  extractYoutubeVideoId(url: string): string {
    const regex = /[?&]v=([^&#]*)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }
}
