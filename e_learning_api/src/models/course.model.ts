import {User} from './user.model';

export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export interface CourseResponseDto {
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
  instructor: User;
  modules: any[];
  enrollments: any[];
  quizzes: any[];
  announcements: any[];
  reviews: any[];
  certificates: any[];
}

export interface CategoryResponseDto {
  id: string;
  name: string;
  description?: string;
  courseCount: number;
  icon?: string;
}
