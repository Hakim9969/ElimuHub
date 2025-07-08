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
    image: string | null;
    instructor: {
      id: string;
      name: string;
    };
  };
  totalLessons: number;
  progress: number;
  progressPercentage: number; // 0–100
  certificateIssued: boolean;
  certificateIssuedAt?: Date;
}
