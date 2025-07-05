import {
  Controller,
  Post,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProgressService } from './progress.service';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  /** Mark a lesson completed */
  @Post('lesson/:lessonId/complete')
  async completeLesson(@Param('lessonId') lessonId: string, @Req() req) {
    return this.progressService.markLessonCompleted(req.user.sub, lessonId);
  }

  /** Get progress + certificate status for a course */
  @Get('course/:courseId')
  async courseProgress(@Param('courseId') courseId: string, @Req() req) {
    return this.progressService.getCourseProgress(req.user.sub, courseId);
  }
}
