import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Quiz} from '../module-list/module-list.component';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent {
  @Input() quiz!: Quiz;
  @Input() isSubmitted: boolean = false;

  @Output() quizCompleted = new EventEmitter<{ correct: boolean; selectedAnswer: number }>();

  selectedAnswer: number | null = null;

  submitQuiz(): void {
    if (this.selectedAnswer !== null) {
      const correct = this.selectedAnswer === this.quiz.correct;
      this.quizCompleted.emit({ correct, selectedAnswer: this.selectedAnswer });
    }
  }
}
