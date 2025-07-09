import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LessonService } from '../../services/lesson.service';

@Component({
  selector: 'app-lesson-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lesson-manager.component.html',
})
export class LessonManagerComponent implements OnInit {
  courseId!: string;
  contentId!: string;

  lessons: any[] = [];
  newLesson = { title: '', description: '' };

  constructor(private route: ActivatedRoute, private lessonService: LessonService) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('courseId')!;
    this.contentId = this.route.snapshot.paramMap.get('contentId')!;
    this.fetchLessons();
  }

  fetchLessons() {
    this.lessonService.getLessons(this.contentId).subscribe({
      next: (data) => (this.lessons = data),
      error: (err) => console.error(err),
    });
  }

  addLesson() {
    if (!this.newLesson.title.trim()) return;

    this.lessonService.addLesson(this.contentId, this.newLesson).subscribe({
      next: (data) => {
        this.lessons.push(data);
        this.newLesson = { title: '', description: '' };
      },
      error: (err) => console.error(err),
    });
  }
}
