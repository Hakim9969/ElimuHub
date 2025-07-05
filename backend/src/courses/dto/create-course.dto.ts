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
  prerequisiteCourseId?: string; // FK to another course

  @IsOptional()
  @IsString()
  prerequisites?: string; // Text-based prerequisite (e.g., "Basic HTML")

  @IsOptional()
  @IsString()
  image?: string; // Course thumbnail URL or path
}
