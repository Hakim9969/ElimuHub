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

  async enrollUserInCourse(
    userId: string,
    courseId: string,
  ): Promise<EnrollmentWithCourseAndProgress> {
    const existing = await this.prisma.enrollment.findFirst({
      where: { userId, courseId },
    });
    if (existing)
      throw new ConflictException('User is already enrolled in this course.');

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        prerequisite: true,
        instructor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!course) throw new NotFoundException('Course not found');

    if (course.prerequisiteCourseId) {
      const prereq = await this.prisma.enrollment.findFirst({
        where: {
          userId,
          courseId: course.prerequisiteCourseId,
          progress: { some: { completed: true } },
        },
      });
      if (!prereq)
        throw new ForbiddenException(
          'You must be a student to enroll.',
        );
    }

    const enrollment = await this.prisma.enrollment.create({
      data: { userId, courseId },
    });

    const progressDto = await this.progressService.getCourseProgress(
      userId,
      courseId,
    );

    return {
      id: enrollment.id,
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      enrolledAt: enrollment.enrolledAt,
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
        category: course.category,
        difficulty: course.difficulty,
        published: course.published,
        image: course.image,
        instructor: course.instructor,
      },
      progress: progressDto.completedLessons,
      totalLessons: progressDto.totalLessons,
      progressPercentage: progressDto.progressPercentage,
      certificateIssued: progressDto.certificateIssued,
      certificateIssuedAt: progressDto.issuedAt,
    };
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
            image: true, // Include image if used
            instructor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return await Promise.all(
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
          course: {
            id: enr.course.id,
            title: enr.course.title,
            description: enr.course.description,
            category: enr.course.category,
            difficulty: enr.course.difficulty,
            published: enr.course.published,
            image: enr.course.image,
            instructor: enr.course.instructor,
          },
          progress: progressDto.completedLessons,
          totalLessons: progressDto.totalLessons,
          progressPercentage: progressDto.progressPercentage,
          certificateIssued: progressDto.certificateIssued,
          certificateIssuedAt: progressDto.issuedAt,
        };
      }),
    );
  }

  async unenrollUserFromCourse(userId: string, courseId: string) {
    return this.prisma.enrollment.deleteMany({ where: { userId, courseId } });
  }
}
