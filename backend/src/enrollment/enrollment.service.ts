import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EnrollmentService {
  constructor(private prisma: PrismaService) {}

  async enrollUserInCourse(userId: string, courseId: string) {
    const existing = await this.prisma.enrollment.findFirst({
      where: { userId, courseId },
    });

    if (existing) throw new ConflictException('Already enrolled');

    // Check prerequisites
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { prerequisite: true },
    });

    if (course?.prerequisiteCourseId) {
      const prerequisiteEnrollment = await this.prisma.enrollment.findFirst({
        where: {
          userId,
          courseId: course.prerequisiteCourseId,
          progress: {
            some: { completed: true }, 
          },
        },
      });

      if (!prerequisiteEnrollment) {
        throw new ForbiddenException('Prerequisite course not completed');
      }
    }

    return this.prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
    });
  }

  async getDashboard(userId: string) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: true,
        progress: true,
      },
    });
  }

  async unenrollUserFromCourse(userId: string, courseId: string) {
    return this.prisma.enrollment.deleteMany({
      where: { userId, courseId },
    });
  }
}
