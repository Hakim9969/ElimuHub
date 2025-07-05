import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourseProgressResponseDto } from './dtos/course-progress-reponse.dto';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  /** Mark a single lesson completed for the current user */
  async markLessonCompleted(userId: string, lessonId: string) {
    // 1. Load lesson → module → courseId
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');

    const courseId = lesson.module.courseId;

    // 2. Find enrollment for this user + course
    const enrollment = await this.prisma.enrollment.findFirst({
      where: { userId, courseId },
    });
    if (!enrollment) {
      throw new ForbiddenException('Not enrolled in this course');
    }

    // 3. Upsert Progress record
    return this.prisma.progress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId,
        completed: true,
        completedAt: new Date(),
      },
    });
  }

  /** Calculate progress for a given user + course,
   *  and auto-issue certificate if 100% complete */
  async getCourseProgress(
    userId: string,
    courseId: string,
  ): Promise<CourseProgressResponseDto> {
    // 1. Ensure enrollment exists
    const enrollment = await this.prisma.enrollment.findFirst({
      where: { userId, courseId },
    });
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    // 2. Count total lessons in course
    const totalLessons = await this.prisma.lesson.count({
      where: { module: { courseId } },
    });

    // 3. Count completed lessons
    const completedLessons = await this.prisma.progress.count({
      where: { enrollmentId: enrollment.id, completed: true },
    });

    // 4. Compute percentage
    const progressPercentage =
      totalLessons === 0
        ? 0
        : Math.floor((completedLessons / totalLessons) * 100);

    // 5. Certificate check
    let certificate = await this.prisma.certificate.findFirst({
      where: { userId, courseId },
    });

    // Issue if 100% and not yet issued
    if (progressPercentage === 100 && !certificate) {
      certificate = await this.prisma.certificate.create({
        data: { userId, courseId },
      });
    }

    return {
      courseId,
      totalLessons,
      completedLessons,
      progressPercentage,
      certificateIssued: Boolean(certificate),
      issuedAt: certificate?.issuedAt,
    };
  }
}
