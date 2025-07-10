import { $Enums } from '../../../generated/prisma';
import QuestionType = $Enums.QuestionType;
import { AttemptStatus } from '../interfaces/quiz.interface';

export class QuizResponseDto {
  id: string;
  title: string;
  description?: string;
  timeLimit?: number;
  maxAttempts?: number;
  passingScore: number;
  published: boolean;
  questions: QuestionResponseDto[];
}

export class QuestionResponseDto {
  id: string;
  type: QuestionType;
  text: string;
  options: string[];
  points: number;
  order: number;
}

export class AttemptResponseDto {
  id: string;
  attemptNumber: number;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  startedAt: Date;
  submittedAt?: Date;
  status: AttemptStatus;
  quiz: QuizResponseDto;
}