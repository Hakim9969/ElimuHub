import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
} from '@nestjs/common';
import {QuizzesService} from "./quizzes.service";
import {CreateQuizDto} from "./interfaces/create-quiz.dto";
import {StartQuizDto} from "./interfaces/start-quiz.dto";
import {SubmitAnswerDto} from "./interfaces/submit-answer.dto";



@Controller('quiz')
export class QuizzesController {
    constructor(private readonly quizzesService: QuizzesService) {}

    @Post()
    async createQuiz(@Body() createQuizDto: CreateQuizDto) {
        return this.quizzesService.createQuiz(createQuizDto);
    }

    @Get(':id')
    async getQuiz(@Param('id') id: string) {
        return this.quizzesService.getQuiz(id);
    }

    @Post(':id/start')
    async startQuiz(@Param('id') id: string, @Body() startQuizDto: StartQuizDto) {
        return this.quizzesService.startQuiz(id, startQuizDto);
    }

    @Get(':id/stats')
    async getQuizStats(@Param('id') id: string) {
        return this.quizzesService.getQuizStats(id);
    }

    @Get('user/:userId/attempts')
    async getUserAttempts(
        @Param('userId') userId: string,
        @Query('quizId') quizId: string,
    ) {
        return this.quizzesService.getUserAttempts(userId, quizId);
    }

    @Post('attempt/:id/answer')
    async submitAnswer(
        @Param('id') attemptId: string,
        @Body() submitAnswerDto: SubmitAnswerDto,
    ) {
        return this.quizzesService.submitAnswer(attemptId, submitAnswerDto);
    }

    @Post('attempt/:id/submit')
    async submitQuiz(@Param('id') attemptId: string) {
        return this.quizzesService.submitQuiz(attemptId);
    }
}
