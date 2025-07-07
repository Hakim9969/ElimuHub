import { IsString } from 'class-validator';

export class MarkLessonCompleteDto {
  @IsString()
  lessonId: string;
}