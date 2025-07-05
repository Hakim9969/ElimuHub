import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonService {
    constructor(private prisma: PrismaService) {}

  async create(moduleId: string, instructorId: string, dto: CreateLessonDto) {
    const content = await this.prisma.content.findUnique({
      where: { id: moduleId },
      include: { course: true },
    });

    if (!content || content.course.instructorId !== instructorId) {
      throw new ForbiddenException('You cannot add lessons to this module');
    }

    return this.prisma.lesson.create({
      data: {
        ...dto,
        moduleId,
      },
    });
  }

  async findAll(moduleId: string) {
    return this.prisma.lesson.findMany({
      where: { moduleId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(id: string, dto: UpdateLessonDto) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) throw new NotFoundException('Lesson not found');

    return this.prisma.lesson.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) throw new NotFoundException('Lesson not found');

    return this.prisma.lesson.delete({ where: { id } });
  }
}
