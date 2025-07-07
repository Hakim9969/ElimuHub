import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-module-list',
  imports: [CommonModule],
  templateUrl: './module-list.component.html',
  styleUrl: './module-list.component.css'
})

export interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  completed: boolean;
  content: string;
  quiz: Quiz;
}

export interface Quiz {
  question: string;
  options: string[];
  correct: number;
}
export class ModuleListComponent {
  @Input() modules: Module[] = [];
  @Input() selectedModuleId: number | null = null;
  @Input() selectedLessonId: number | null = null;
  @Input() completedLessons: Set<number> = new Set();

  @Output() moduleSelected = new EventEmitter<number>();
  @Output() lessonSelected = new EventEmitter<Lesson>();

  onModuleClick(moduleId: number): void {
    this.moduleSelected.emit(moduleId);
  }

  onLessonSelected(lesson: Lesson): void {
    this.lessonSelected.emit(lesson);
  }

  getCompletedCount(moduleId: number): number {
    const module = this.modules.find(m => m.id === moduleId);
    if (!module) return 0;
    return module.lessons.filter(lesson => this.completedLessons.has(lesson.id)).length;
  }
}
