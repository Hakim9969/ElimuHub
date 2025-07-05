import { IsString, IsEnum, IsOptional } from 'class-validator';
import { Difficulty } from 'generated/prisma';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @IsOptional()
  @IsString()
  objectives?: string;

  @IsOptional()
  @IsString()
  prerequisites?: string;
}
