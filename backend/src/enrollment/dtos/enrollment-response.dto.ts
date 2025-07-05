export class EnrollmentResponseDto {
  enrollmentId: string;
  enrolledAt: Date;
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
