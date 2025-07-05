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
  progress: {
    lessonId: string;
    completed: boolean;
  }[];
}
