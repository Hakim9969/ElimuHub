import { User } from './user.model'; // Align with your colleague's import

export enum Difficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
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
  createdAt: Date; // aligned to their format
  updatedAt: Date;
  instructor: User;

  modules: ModuleDto[];
  enrollments: EnrollmentResponseDto[]; // type-safe
  quizzes: QuizDto[];
  announcements: Announcement[];
  reviews: Review[];
  certificates: Certificate[];
}

// ---- Category ----

export interface CategoryResponseDto {
  id: string;
  name: string;
  description?: string;
  courseCount?: number; // your version had this
  icon?: string; // optional
}

// ---- Module, Lesson, Quiz ----

export interface ModuleDto {
  id: string;
  title: string;
  description: string;
  lessons: LessonDto[];
  order: number;
  isCompleted?: boolean;
}

export interface LessonDto {
  id: string;
  title: string;
  content: string;
  duration: string;
  order: number;
  videoUrl?: string;
  quiz?: QuizDto;
  isCompleted?: boolean;
}

export interface QuizDto {
  id: string;
  questions: QuestionDto[];
  passingScore: number;
}

export interface QuestionDto {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  type: 'multiple-choice' | 'true-false';
}

// ---- Enrollment ----

export interface EnrollmentResponseDto {
  enrollmentId: string;
  courseId: string;
  enrolledAt: Date;
  course: CourseResponseDto;
  totalLessons: number;
  progress: number;
  progressPercentage: number;
  certificateIssued: boolean;
  certificateIssuedAt?: Date;
}

// ---- Announcements, Reviews, Certificates ----

export interface Announcement {
  id: string;
  content: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  issuedAt: Date;
}
