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
  totalLessons: number;
  progress: number;
  progressPercentage: number;
  certificateIssued: boolean;
  certificateIssuedAt?: Date;
}