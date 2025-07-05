// src/courses/dto/course-response.dto.ts
import { Difficulty } from 'generated/prisma';
import { UserResponse } from 'src/users/interfaces/user.interface';

export class CourseResponseDto {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  objectives?: string;
  prerequisites?: string;
  published: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;

  instructor: UserResponse;
  modules: any[];
  enrollments: any[];
  quizzes: any[];
  announcements: any[];
  reviews: any[];
  certificates: any[];
}
