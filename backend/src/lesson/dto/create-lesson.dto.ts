import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LessonType } from 'generated/prisma';

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  contentUrl?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsEnum(LessonType)
  type: LessonType;
}
