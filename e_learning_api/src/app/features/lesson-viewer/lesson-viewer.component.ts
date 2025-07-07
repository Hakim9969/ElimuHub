import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Lesson} from '../module-list/module-list.component';
import { NextModuleButtonComponent } from './next-module-button.component';

@Component({
  selector: 'app-lesson-viewer',
  imports: [],
  templateUrl: './lesson-viewer.component.html',
  styleUrl: './lesson-viewer.component.css'
})
export class LessonViewerComponent {
  @Input() lesson: Lesson | null = null;
  @Input() selectedModuleId: number | null = null;
  @Input() quizSubmitted: boolean = false;
  @Input() showNextModule: boolean = false;

  @Output() quizCompleted = new EventEmitter<void>();
  @Output() nextModuleClicked = new EventEmitter<void>();

  onQuizCompleted(): void {
    this.quizCompleted.emit();
  }

  onNextModuleClicked(): void {
    this.nextModuleClicked.emit();
  }
}
