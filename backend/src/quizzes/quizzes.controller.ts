import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role-decorator';
import { QuizzesService } from './quizzes.service';
import { StartQuizDto } from './dtos/start-quiz.dto';
import { SubmitAnswerDto } from './dtos/submit-answer.dto';
import { CreateQuizDto } from './dtos/create-quiz.dto';

@Controller('quiz')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  /**
   * Instructors only: create a new quiz
   */
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('INSTRUCTOR')
  async createQuiz(@Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.createQuiz(createQuizDto);
  }

  /**
   * Authenticated users: view quiz questions (instructors and students)
   */
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getQuiz(@Param('id') id: string) {
    return this.quizzesService.getQuiz(id);
  }

  /**
   * Students only: start a quiz attempt
   */
  @Post(':id/start')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('STUDENT')
  async startQuiz(
    @Param('id') id: string,
    @Body() startQuizDto: StartQuizDto,
    @Req() req,
  ) {
    // Add userId to the DTO
    const dtoWithUserId = { ...startQuizDto, userId: req.user.sub };
    return this.quizzesService.startQuiz(id, dtoWithUserId);
  }

  /**
   * Instructors only: get quiz statistics
   */
  @Get(':id/stats')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('INSTRUCTOR')
  async getQuizStats(@Param('id') id: string) {
    return this.quizzesService.getQuizStats(id);
  }

  /**
   * Students or Instructors: get attempts for a specific user (user can view own, instructors can view any)
   */
  @Get('user/:userId/attempts')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('STUDENT', 'INSTRUCTOR', 'ADMIN')
  async getUserAttempts(
    @Param('userId') userId: string,
    @Query('quizId') quizId: string,
    @Req() req,
  ) {
    // enforce student can only access their own attempts
    if (req.user.sub !== userId && !req.user.roles.includes('INSTRUCTOR') && !req.user.roles.includes('ADMIN')) {
      throw new ForbiddenException('Access denied');
    }
    return this.quizzesService.getUserAttempts(userId, quizId);
  }

  /**
   * Students only: submit an answer for an ongoing attempt
   */
  @Post('attempt/:id/answer')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('STUDENT')
  async submitAnswer(
    @Param('id') attemptId: string,
    @Body() submitAnswerDto: SubmitAnswerDto,
    @Req() req,
  ) {
    return this.quizzesService.submitAnswer(attemptId, submitAnswerDto);
  }

  /**
   * Students only: finalize and submit the quiz
   */
  @Post('attempt/:id/submit')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('STUDENT')
  @HttpCode(HttpStatus.OK)
  async submitQuiz(
    @Param('id') attemptId: string,
    @Req() req,
  ) {
    return this.quizzesService.submitQuiz(attemptId);
  }
}