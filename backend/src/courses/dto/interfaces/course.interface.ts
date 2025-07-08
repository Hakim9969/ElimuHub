export interface CourseResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  published: boolean;
  image: string;
  instructor: {
    id: string;
    name: string;
  };
  content: ModuleResponse[];
  enrollments: Enrollment[];
  quizzes: Quiz[];
  announcements: Announcement[];
  reviews: Review[];
  certificates: Certificate[];
}

export interface ModuleResponse {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: LessonResponse[];
}

export interface LessonResponse {
  id: string;
  title: string;
  content: string;
  duration: string;
  order: number;
  quiz: Quiz | null;
}

// These can be expanded further based on your actual Prisma schema
export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  createdAt: Date;
}

export interface Quiz {
  id: string;
  title: string;
  courseId?: string;
  moduleId?: string;
  lessonId?: string;
  // Add more fields if needed
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  courseId: string;
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
