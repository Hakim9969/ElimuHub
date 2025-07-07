export class CourseProgressResponseDto {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number; // 0–100
  certificateIssued: boolean;
  issuedAt?: Date;
}