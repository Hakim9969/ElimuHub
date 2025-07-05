import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnrollmentWithCourseAndProgress } from './interfaces/enrollment.interface';

@Injectable()
export class EnrollmentService {
  constructor(private prisma: PrismaService) {}

  async enrollUserInCourse(userId: string, courseId: string) {
    const existing = await this.prisma.enrollment.findFirst({
      where: { userId, courseId },
    });

    if (existing) {
      throw new ConflictException('User is already enrolled in this course.');
    }

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { prerequisite: true },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if user has completed the prerequisite course
    if (course?.prerequisiteCourseId) {
      const prerequisiteEnrollment = await this.prisma.enrollment.findFirst({
        where: {
          userId,
          courseId: course.prerequisiteCourseId,
          progress: {
            some: { completed: true }, // Assuming `completed: boolean` exists in `Progress`
          },
        },
      });

      if (!prerequisiteEnrollment) {
        throw new ForbiddenException('You must complete the prerequisite course first.');
      }
    }

    return this.prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
    });
  }

  async getDashboard(userId: string): Promise<EnrollmentWithCourseAndProgress[]> {
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
        progress: {
          select: {
            lessonId: true,
            completed: true,
          },
        },
      },
    });

    return enrollments.map((enrollment) => ({
      id: enrollment.id,
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      enrolledAt: enrollment.enrolledAt,
      course: enrollment.course,
      progress: enrollment.progress,
    }));
  }

  async unenrollUserFromCourse(userId: string, courseId: string) {
    return this.prisma.enrollment.deleteMany({
      where: { userId, courseId },
    });
  }
}
