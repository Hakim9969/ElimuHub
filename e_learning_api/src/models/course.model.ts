    import { User } from "./user.model";

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
    content: ModuleDto[];
    enrollments: any[];
    quizzes: any[];
    announcements: any[];
    reviews: any[];
    certificates: any[];
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

    export interface CategoryResponseDto {
      id: string;
      name: string;
      description: string;
    }

    export enum Difficulty {
      BEGINNER = 'beginner',
      INTERMEDIATE = 'intermediate',
      ADVANCED = 'advanced'
    }

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
