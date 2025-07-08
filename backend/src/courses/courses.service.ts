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
        modules: true,
        enrollments: true,
        quizzes: true,
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
    .map(c => c.category)
    .filter(Boolean)
    .map(name => ({ name }));
}



  async findAll() {
    const courses = await this.prisma.course.findMany({
      where: { published: true },
      include: {
        instructor: true,
        modules: true,
        enrollments: true,
        quizzes: true,
        announcements: true,
        reviews: true,
        certificates: true,
      },
    });

    return courses.map(course => this.transformCourse(course));
  }

  async findByInstructor(instructorId: string) {
    const courses = await this.prisma.course.findMany({
      where: { instructorId },
      include: {
        instructor: true,
        modules: true,
        enrollments: true,
        quizzes: true,
        announcements: true,
        reviews: true,
        certificates: true,
      },
    });

    return courses.map(course => this.transformCourse(course));
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: true,
        modules: true,
        enrollments: true,
        quizzes: true,
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
      modules: true,
      enrollments: true,
      quizzes: true,
      announcements: true,
      reviews: true,
      certificates: true,
    },
  });
  

  return courses.map(course => this.transformCourse(course));
 }

  async update(id: string, userId: string, dto: UpdateCourseDto) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    if (course.instructorId !== userId)
      throw new ForbiddenException('You cannot edit this course');

    return this.prisma.course.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, user: any) {
  const course = await this.prisma.course.findUnique({ where: { id } });
  if (!course) throw new NotFoundException('Course not found');
  
  // Allow deletion if user is the instructor OR an admin
  if (course.instructorId !== user.id && user.role !== 'ADMIN') {
    throw new ForbiddenException('You cannot delete this course');
  }

  return this.prisma.course.delete({ where: { id } });
}

async removeByCategory(name: string) {
  const courses = await this.prisma.course.findMany({
    where: { category: name },
  });

  if (!courses.length) {
    throw new NotFoundException(`No courses found under category "${name}"`);
  }

  // Delete all courses under this category
  await this.prisma.course.deleteMany({
    where: { category: name },
  });

  return {
    message: `Deleted ${courses.length} course(s) under category "${name}"`,
  };
}


  private transformCourse(course: any) {
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

    return {
      ...rest,
      instructor,
      content: modules, // ✅ Rename modules to content
      enrollments,
      quizzes,
      announcements,
      reviews,
      certificates,
    };
  }
}
