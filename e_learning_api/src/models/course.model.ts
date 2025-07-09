import { User } from './user.model';

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
  createdAt: Date;
  updatedAt: Date;
  instructor: User;
  contents: ModuleDto[];
  enrollments: any[];
  quizzes: any[];
  announcements: any[];
  reviews: any[];
  certificates: any[];
  lessons?: CourseLessonDto[];
  requirements?: string[];
  whatYouWillLearn?: string[];
  tags?: string[];
  language?: string;
  level?: string;
  certificate?: boolean;
  hasPreview?: boolean;
  previewVideoUrl?: string;
  estimatedCompletionTime?: string;
  lastUpdated?: string;
  totalLessons?: number;
  totalQuizzes?: number;
  totalAssignments?: number;
  skillsGained?: string[];
  careerBenefits?: string[];
  targetAudience?: string[];
  courseOutline?: string;
  relatedCourses?: string[];
}

export interface CourseLessonDto {
  id: string;
  title: string;
  description: string;
  order: number;
  duration: string;
  type: LessonType;
  videoUrl?: string;
  content?: string;
  isCompleted?: boolean;
  isLocked?: boolean;
  notes?: string;
  transcript?: string;
  downloadableResources?: string[];
  practiceExercises?: string[];
}

export interface CategoryResponseDto {
  id: string;
  name: string;
  description: string;
}

export enum LessonType {
  VIDEO = 'video',
  TEXT = 'text',
  QUIZ = 'quiz',
  ASSIGNMENT = 'assignment',
  LIVE = 'live',
  INTERACTIVE = 'interactive',
  DOWNLOAD = 'download'
}

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
  contentUrl?: string;
  type: string;
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
