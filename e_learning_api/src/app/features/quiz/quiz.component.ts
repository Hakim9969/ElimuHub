import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {QuestionDto, QuizDto} from "../../../models/course.model";

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent implements OnInit {
  @Input() quiz!: QuizDto;
  @Output() quizCompleted = new EventEmitter<boolean>();

  currentQuestionIndex = 0;
  selectedAnswer: number | null = null;
  answers: (number | null)[] = [];
  correctAnswers = 0;
  showResults = false;
  quizPassed = false;
  scorePercentage = 0;

  get currentQuestion(): QuestionDto {
    return this.quiz.questions[this.currentQuestionIndex];
  }

  ngOnInit() {
    this.answers = new Array(this.quiz.questions.length).fill(null);
    this.selectedAnswer = this.answers[0];
  }

  nextQuestion() {
    this.answers[this.currentQuestionIndex] = this.selectedAnswer;

    if (this.currentQuestionIndex < this.quiz.questions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedAnswer = this.answers[this.currentQuestionIndex];
    } else {
      this.finishQuiz();
    }
  }

  previousQuestion() {
    this.answers[this.currentQuestionIndex] = this.selectedAnswer;
    this.currentQuestionIndex--;
    this.selectedAnswer = this.answers[this.currentQuestionIndex];
  }

  finishQuiz() {
    this.answers[this.currentQuestionIndex] = this.selectedAnswer;
    this.calculateScore();
    this.showResults = true;
    this.quizCompleted.emit(this.quizPassed);
  }

  calculateScore() {
    this.correctAnswers = 0;

    for (let i = 0; i < this.quiz.questions.length; i++) {
      if (this.answers[i] === this.quiz.questions[i].correctAnswer) {
        this.correctAnswers++;
      }
    }

    this.scorePercentage = Math.round((this.correctAnswers / this.quiz.questions.length) * 100);
    this.quizPassed = this.scorePercentage >= this.quiz.passingScore;
  }

  retakeQuiz() {
    this.currentQuestionIndex = 0;
    this.selectedAnswer = null;
    this.answers = new Array(this.quiz.questions.length).fill(null);
    this.correctAnswers = 0;
    this.showResults = false;
    this.quizPassed = false;
    this.scorePercentage = 0;
  }

  continueToNext() {
    // This could trigger navigation to next lesson or module
    console.log('Continue to next content');
  }
}
