import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
    constructor(private prisma: PrismaService) {}

  async create(instructorId: string, dto: CreateCourseDto) {
    return this.prisma.course.create({
      data: {
        ...dto,
        instructorId,
      },
    });
  }

  async findAll() {
    return this.prisma.course.findMany({
      where: { published: true },
      include: { instructor: true },
    });
  }

  async findByInstructor(instructorId: string) {
    return this.prisma.course.findMany({
      where: { instructorId },
    });
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async update(id: string, userId: string, dto: UpdateCourseDto) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    if (course.instructorId !== userId) throw new ForbiddenException('You cannot edit this course');

    return this.prisma.course.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    if (course.instructorId !== userId) throw new ForbiddenException('You cannot delete this course');

    return this.prisma.course.delete({ where: { id } });
  }
}
