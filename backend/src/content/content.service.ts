import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async create(courseId: string, instructorId: string, dto: CreateContentDto) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course || course.instructorId !== instructorId) {
      throw new ForbiddenException('Unauthorized to add content to this course');
    }

    return this.prisma.content.create({
      data: {
        ...dto,
        courseId,
      },
    });
  }

  async findAll(courseId: string) {
  const contents = await this.prisma.content.findMany({
    where: { courseId },
    orderBy: { order: 'asc' },
    include: {
      lessons: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  // Rename "lessons" to "lesson"
  return contents.map((content) => ({
    ...content,
    lesson: content.lessons,
    lessons: undefined, // remove original "lessons" key
  }));
}


  async update(id: string, dto: UpdateContentDto) {
    const content = await this.prisma.content.findUnique({ where: { id } });
    if (!content) throw new NotFoundException('Content not found');

    return this.prisma.content.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string, role: string) {
  const content = await this.prisma.content.findUnique({
    where: { id },
    include: { course: true },
  });

  if (!content) {
    throw new NotFoundException('Content not found');
  }

  if (role !== 'ADMIN' && content.course.instructorId !== userId) {
    throw new ForbiddenException('You are not authorized to delete this content');
  }

  await this.prisma.content.delete({ where: { id } });

  // Return nothing for 204 No Content
  return;
}

}
