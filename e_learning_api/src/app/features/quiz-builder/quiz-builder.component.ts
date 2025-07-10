import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizService } from '../../services/quiz.service';

@Component({
  selector: 'app-quiz-builder',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, CommonModule],
  templateUrl: './quiz-builder.component.html'
})
export class QuizBuilderComponent {
  courseId = '';

  quiz = {
    title: '',
    description: '',
    timeLimit: null as number | null,
    maxAttempts: null as number | null,
    passingScore: 70,
    published: false,
    courseId: '',
    questions: [] as {
      type: string;
      text: string;
      options: string[];
      answer: string;
      points: number;
    }[]
  };

  newQuestion = {
    type: 'MCQ',
    text: '',
    options: [''],
    answer: '',
    points: 1
  };

  constructor(private route: ActivatedRoute, private quizService: QuizService) {
    this.courseId = this.route.snapshot.paramMap.get('courseId')!;
    this.quiz.courseId = this.courseId;
  }

  addOption() {
    this.newQuestion.options.push('');
  }

  addQuestion() {
    this.quiz.questions.push({ ...this.newQuestion });
    this.newQuestion = { type: 'MCQ', text: '', options: [''], answer: '', points: 1 };
  }

  removeQuestion(index: number) {
    this.quiz.questions.splice(index, 1);
  }

  submitQuiz() {
    this.quizService.createQuiz(this.quiz).subscribe({
      next: () => alert('Quiz created successfully!'),
      error: (err) => alert('Error: ' + err.message)
    });
  }
}
