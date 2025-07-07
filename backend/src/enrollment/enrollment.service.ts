import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProgressService } from 'src/progress/progress.service';
import { EnrollmentWithCourseAndProgress } from './interfaces/enrollment.interface';

@Injectable()
export class EnrollmentService {
  constructor(
    private prisma: PrismaService,
    private progressService: ProgressService,
  ) {}

  async enrollUserInCourse(userId: string, courseId: string) {
    const existing = await this.prisma.enrollment.findFirst({
      where: { userId, courseId },
    });
    if (existing)
      throw new ConflictException('User is already enrolled in this course.');

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { prerequisite: true },
    });
    if (!course) throw new NotFoundException('Course not found');

    if (course?.prerequisiteCourseId) {
      const prereq = await this.prisma.enrollment.findFirst({
        where: {
          userId,
          courseId: course.prerequisiteCourseId,
          progress: { some: { completed: true } },
        },
      });
      if (!prereq)
        throw new ForbiddenException(
          'You must complete the prerequisite course first.',
        );
    }

    return this.prisma.enrollment.create({ data: { userId, courseId } });
  }

  async getDashboard(
    userId: string,
  ): Promise<EnrollmentWithCourseAndProgress[]> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            difficulty: true,
            published: true,
          },
        },
      },
    });

    const detailed = await Promise.all(
      enrollments.map(async (enr) => {
        const progressDto = await this.progressService.getCourseProgress(
          userId,
          enr.courseId,
        );
        return {
          id: enr.id,
          userId: enr.userId,
          courseId: enr.courseId,
          enrolledAt: enr.enrolledAt,
          course: enr.course,
          progress: progressDto.completedLessons,
          totalLessons: progressDto.totalLessons,
          progressPercentage: progressDto.progressPercentage,
          certificateIssued: progressDto.certificateIssued,
          certificateIssuedAt: progressDto.issuedAt,
        };
      }),
    );

    return detailed;
  }

  async unenrollUserFromCourse(userId: string, courseId: string) {
    return this.prisma.enrollment.deleteMany({ where: { userId, courseId } });
  }
}
