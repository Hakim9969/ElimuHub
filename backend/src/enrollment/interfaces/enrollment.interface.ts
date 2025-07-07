export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
}

export interface EnrollmentWithCourseAndProgress extends Enrollment {
  course: {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    published: boolean;
  };
  // existing raw progress entries removed, replaced by counts and percentage
  totalLessons: number;
  progress: number;           // completed lessons count
  progressPercentage: number; // 0–100
  certificateIssued: boolean;
  certificateIssuedAt?: Date;
}