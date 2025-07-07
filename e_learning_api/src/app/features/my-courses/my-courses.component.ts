import {Component, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {EnrollmentResponse, EnrollmentService} from '../../services/enrollment.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {HeaderComponent} from '../shared/components/header/header.component';
import {FooterComponent} from '../shared/components/footer/footer.component';
import {CourseResponseDto, Difficulty} from '../../../models/course.model';

@Component({
  selector: 'app-my-courses',
  imports: [
    NgForOf,
    NgIf,
    DatePipe,
    HeaderComponent,
    FooterComponent,
    TitleCasePipe
  ],
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.css'
})
export class MyCoursesComponent implements OnInit {
  enrollments: EnrollmentResponse[] = [];
  coursesLoading = true;
  error: string | null = null;
  currentUserId: string | null = null;

  constructor(
    private router: Router,
    private enrollmentService: EnrollmentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUserId = this.authService.getCurrentUser()?.id ?? null;
    if (this.currentUserId) {
      this.loadEnrollments();
    } else {
      this.coursesLoading = false;
      this.error = 'User not authenticated';
    }
  }

  private loadEnrollments() {
    if (!this.currentUserId) return;

    this.coursesLoading = true;
    this.error = null;

    this.enrollmentService.getUserEnrollments().subscribe({
      next: (enrollments) => {
        this.enrollments = enrollments;
        this.coursesLoading = false;
      },
      error: (error) => {
        console.error('Error loading enrollments:', error);
        this.error = 'Failed to load enrollments. Please try again.';
        this.coursesLoading = false;
      }
    });
  }

  getCourseImage(course: CourseResponseDto): string {
    return course.image || '/assets/images/default-course.png';
  }

  getDifficultyColorClass(difficulty: Difficulty): string {
    const colorMap = {
      [Difficulty.BEGINNER]: 'text-green-600',
      [Difficulty.INTERMEDIATE]: 'text-yellow-600',
      [Difficulty.ADVANCED]: 'text-red-600'
    };
    return colorMap[difficulty] || 'text-gray-600';
  }

  getInstructorName(course: CourseResponseDto): string {
    return `${course.instructor.name} `;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  startLearning(courseId: string) {
    this.router.navigate(['/course', courseId, 'learn']);
  }

  unenroll(courseId: string) {
    if (!this.currentUserId) return;

    if (confirm('Are you sure you want to unenroll from this course? This action cannot be undone.')) {
      this.enrollmentService.unenrollUserFromCourse(this.currentUserId, courseId).subscribe({
        next: () => {
          // Reload enrollments after successful unenrollment
          this.loadEnrollments();
        },
        error: (error) => {
          console.error('Error unenrolling from course:', error);
          alert('Failed to unenroll from course. Please try again.');
        }
      });
    }
  }

  browseCourses() {
    this.router.navigate(['/courses']);
  }
}
