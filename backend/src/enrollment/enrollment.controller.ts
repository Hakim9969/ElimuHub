import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post(':courseId/enroll')
  @UseGuards(JwtAuthGuard)
  async enroll(@Param('courseId') courseId: string, @Req() req) {
    return this.enrollmentService.enrollUserInCourse(req.user.sub, courseId);
  }

  @Get('me/dashboard')
  @UseGuards(JwtAuthGuard)
  async getStudentDashboard(@Req() req) {
    return this.enrollmentService.getDashboard(req.user.sub);
  }

  @Delete(':courseId/unenroll')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT) // Better REST convention
  async unenroll(@Param('courseId') courseId: string, @Req() req) {
    await this.enrollmentService.unenrollUserFromCourse(req.user.sub, courseId);
  }
}
