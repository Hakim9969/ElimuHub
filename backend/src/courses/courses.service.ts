import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(instructorId: string, dto: CreateCourseDto) {
    const course = await this.prisma.course.create({
      data: {
        ...dto,
        instructorId,
      },
      include: {
        instructor: true,
        modules: {
          include: {
            lessons: true,
          },
        },
        enrollments: true,
        quizzes: {
          include: {
            attempts: true,
          },
        },
        announcements: true,
        reviews: true,
        certificates: true,
      },
    });

    return this.transformCourse(course);
  }

  async findAllCategories(): Promise<{ name: string }[]> {
    const categories = await this.prisma.course.findMany({
      where: {
        published: true,
      },
      select: {
        category: true,
      },
      distinct: ['category'],
    });

    return categories
      .map((c) => c.category)
      .filter(Boolean)
      .map((name) => ({ name }));
  }

  async findAll() {
    const courses = await this.prisma.course.findMany({
      where: { published: true },
      include: {
        instructor: true,
        modules: {
          include: {
            lessons: true,
          },
        },
        enrollments: true,
        quizzes: {
          include: {
            attempts: true,
          },
        },
        announcements: true,
        reviews: true,
        certificates: true,
      },
    });

    return courses.map((course) => this.transformCourse(course));
  }

  async findByInstructor(instructorId: string) {
    const courses = await this.prisma.course.findMany({
      where: { instructorId },
      include: {
        instructor: true,
        modules: {
          include: {
            lessons: true,
          },
        },
        enrollments: true,
        quizzes: {
          include: {
            attempts: true,
          },
        },
        announcements: true,
        reviews: true,
        certificates: true,
      },
    });

    return courses.map((course) => this.transformCourse(course));
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: true,
        modules: {
          include: {
            lessons: true,
          },
        },
        enrollments: true,
        quizzes: {
          include: {
            attempts: true,
          },
        },
        announcements: true,
        reviews: true,
        certificates: true,
      },
    });

    if (!course) throw new NotFoundException('Course not found');

    return this.transformCourse(course);
  }

  async findByCategory(category: string) {
    const courses = await this.prisma.course.findMany({
      where: {
        category,
        published: true,
      },
      include: {
        instructor: true,
        modules: {
          include: {
            lessons: true,
          },
        },
        enrollments: true,
        quizzes: {
          include: {
            attempts: true,
          },
        },
        announcements: true,
        reviews: true,
        certificates: true,
      },
    });

    return courses.map((course) => this.transformCourse(course));
  }

  async update(id: string, userId: string, dto: UpdateCourseDto) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    if (course.instructorId !== userId)
      throw new ForbiddenException('You cannot edit this course');

    const updatedCourse = await this.prisma.course.update({
      where: { id },
      data: dto,
      include: {
        instructor: true,
        modules: {
          include: {
            lessons: true,
          },
        },
        enrollments: true,
        quizzes: {
          include: {
            attempts: true,
          },
        },
        announcements: true,
        reviews: true,
        certificates: true,
      },
    });

    return this.transformCourse(updatedCourse);
  }

  async remove(id: string, userId: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    if (course.instructorId !== userId)
      throw new ForbiddenException('You cannot delete this course');

    return this.prisma.course.delete({ where: { id } });
  }

  private transformCourse(course: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const {
      modules,
      instructor,
      enrollments,
      quizzes,
      announcements,
      reviews,
      certificates,
      ...rest
    } = course;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return {
      ...rest,
      instructor: {
        id: instructor.id,
        name: instructor.name,
      },
      contents: modules?.map((module) => ({
          id: module.id,
          title: module.title,
          description: module.description,
          order: module.order,
          lessons:
            module.lessons?.map((lesson) => ({
              id: lesson.id,
              title: lesson.title,
              contentUrl: lesson.contentUrl,
              type: lesson.type,
              order: lesson.order,
            })) ?? [],
        })) ?? [],
      enrollments: enrollments ?? [],
      quizzes:
        quizzes?.map((quiz) => ({
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          published: quiz.published,
          attempts:
            quiz.attempts?.map((attempt) => ({
              id: attempt.id,
              attemptNumber: attempt.attemptNumber,
              score: attempt.score,
              percentage: attempt.percentage,
              passed: attempt.passed,
              status: attempt.status,
            })) ?? [],
        })) ?? [],
      announcements: announcements ?? [],
      reviews: reviews ?? [],
      certificates: certificates ?? [],
    };
  }
}
