import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Lesson} from '../module-list/module-list.component';

@Component({
  selector: 'app-lesson-list',
  imports: [],
  templateUrl: './lesson-list.component.html',
  styleUrl: './lesson-list.component.css'
})
export class LessonListComponent {
  @Input() lessons: Lesson[] = [];
  @Input() selectedLessonId: number | null = null;
  @Input() completedLessons: Set<number> = new Set();

  @Output() lessonSelected = new EventEmitter<Lesson>();

  onLessonClick(lesson: Lesson): void {
    this.lessonSelected.emit(lesson);
  }
}
