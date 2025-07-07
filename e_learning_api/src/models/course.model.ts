import { UserResponse } from './user.model';

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
  createdAt: string; 
  updatedAt: string;
  instructor: UserResponse;

  // These support both landing and instructor dashboard
  modules: ContentModule[];
  enrollments: Enrollment[];
  quizzes: Quiz[];
  announcements: Announcement[];
  reviews: Review[];
  certificates: Certificate[];
}

export interface CategoryResponseDto {
  id: string;
  name: string;
  description?: string;
  courseCount: number;
  icon?: string;
}

// Related Interfaces

export interface ContentModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  createdAt: string;
  duration?: number;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  totalMarks: number;
  createdAt: string;
}

export interface Announcement {
  id: string;
  content: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  issuedAt: string;
}
