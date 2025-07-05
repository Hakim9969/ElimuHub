import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StartQuizDto } from './dtos/start-quiz.dto';
import { SubmitAnswerDto } from './dtos/submit-answer.dto';
import { AttemptStatus } from './interfaces/quiz.interface';
import { $Enums } from '../../generated/prisma';
import QuestionType = $Enums.QuestionType;
import { CreateQuizDto } from './dtos/create-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  async createQuiz(createQuizDto: CreateQuizDto) {
    const { questions, ...quizData } = createQuizDto;

    return this.prisma.quiz.create({
      data: {
        ...quizData,
        questions: {
          create: questions.map((q, index) => ({
            ...q,
            order: q.order || index,
          })),
        },
      },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async getQuiz(quizId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            type: true,
            text: true,
            options: true,
            points: true,
            order: true,
            // Don't include answer
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return quiz;
  }

  async startQuiz(quizId: string, startQuizDto: StartQuizDto) {
    const { userId } = startQuizDto;

    // Get quiz with attempts
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
        attempts: {
          where: { userId },
          orderBy: { attemptNumber: 'desc' },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (!quiz.published) {
      throw new BadRequestException('Quiz not published');
    }

    // Check max attempts
    if (quiz.maxAttempts && quiz.attempts.length >= quiz.maxAttempts) {
      throw new BadRequestException('Maximum attempts reached');
    }

    // Check for existing in-progress attempt
    const inProgressAttempt = quiz.attempts.find(
      (a) => a.status === AttemptStatus.IN_PROGRESS,
    );
    if (inProgressAttempt) {
      return this.getAttemptWithQuiz(inProgressAttempt.id);
    }

    // Calculate max score
    const maxScore = quiz.questions.reduce((sum, q) => sum + q.points, 0);

    // Create new attempt
    const attempt = await this.prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        attemptNumber: quiz.attempts.length + 1,
        maxScore,
      },
    });

    return this.getAttemptWithQuiz(attempt.id);
  }

  async submitAnswer(attemptId: string, submitAnswerDto: SubmitAnswerDto) {
    const { questionId, answer } = submitAnswerDto;

    // Get attempt with quiz
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: { quiz: true },
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new BadRequestException('Attempt not in progress');
    }

    // Check time limit
    if (attempt.quiz.timeLimit) {
      const timeElapsed = Math.floor(
        (Date.now() - attempt.startedAt.getTime()) / 1000 / 60,
      );
      if (timeElapsed > attempt.quiz.timeLimit) {
        await this.expireAttempt(attemptId);
        throw new BadRequestException('Time limit exceeded');
      }
    }

    // Get question
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    // Grade answer
    const isCorrect = this.gradeAnswer(question, answer);
    const pointsEarned = isCorrect ? question.points : 0;

    // Save response
    return this.prisma.quizResponse.upsert({
      where: {
        attemptId_questionId: {
          attemptId,
          questionId,
        },
      },
      update: {
        answer,
        isCorrect,
        pointsEarned,
      },
      create: {
        attemptId,
        questionId,
        answer,
        isCorrect,
        pointsEarned,
      },
    });
  }

  async submitQuiz(attemptId: string) {
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        responses: true,
        quiz: true,
      },
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new BadRequestException('Attempt already submitted');
    }

    // Calculate score
    const totalScore = attempt.responses.reduce(
      (sum, r) => sum + r.pointsEarned,
      0,
    );
    const percentage = (totalScore / attempt.maxScore) * 100;
    const passed = percentage >= attempt.quiz.passingScore;

    // Update attempt
    return this.prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        score: totalScore,
        percentage,
        passed,
        submittedAt: new Date(),
        status: AttemptStatus.SUBMITTED,
      },
      include: {
        responses: {
          include: {
            question: true,
          },
        },
        quiz: true,
      },
    });
  }

  async getUserAttempts(userId: string, quizId: string) {
    return this.prisma.quizAttempt.findMany({
      where: { userId, quizId },
      include: {
        responses: {
          include: {
            question: true,
          },
        },
      },
      orderBy: { attemptNumber: 'desc' },
    });
  }

  async getQuizStats(quizId: string) {
    const attempts = await this.prisma.quizAttempt.findMany({
      where: { quizId, status: AttemptStatus.SUBMITTED },
      include: { user: { select: { id: true, name: true } } },
    });

    const total = attempts.length;
    const passed = attempts.filter((a) => a.passed).length;
    const average =
      total > 0
        ? attempts.reduce((sum, a) => sum + a.percentage, 0) / total
        : 0;

    return {
      totalAttempts: total,
      passedAttempts: passed,
      passRate: total > 0 ? (passed / total) * 100 : 0,
      averageScore: average,
      attempts: attempts.map((a) => ({
        id: a.id,
        userName: a.user.name,
        score: a.percentage,
        passed: a.passed,
        submittedAt: a.submittedAt,
      })),
    };
  }

  // Private methods
  private async getAttemptWithQuiz(attemptId: string) {
    return this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: {
          include: {
            questions: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                type: true,
                text: true,
                options: true,
                points: true,
                order: true,
              },
            },
          },
        },
      },
    });
  }

  private async expireAttempt(attemptId: string) {
    return this.prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        status: AttemptStatus.EXPIRED,
        submittedAt: new Date(),
      },
    });
  }

  private gradeAnswer(question: any, answer: string): boolean {
    const userAnswer = answer.toLowerCase().trim();
    const correctAnswer = question.answer.toLowerCase().trim();
    switch (question.type) {
      case QuestionType.MCQ:
      case QuestionType.TRUE_FALSE:
      case QuestionType.SHORT_ANSWER:
        return userAnswer === correctAnswer;
      default:
        return false;
    }
  }
}
