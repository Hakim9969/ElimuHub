import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {CourseResponseDto} from '../../../models/course.model';
import {NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {HeaderComponent} from '../shared/components/header/header.component';
import {FooterComponent} from '../shared/components/footer/footer.component';
import {CourseService} from "../../services/course.service";

@Component({
  selector: 'app-course-details',
  templateUrl: './courses-details.component.html',
  imports: [
    TitleCasePipe,
    NgIf,
    HeaderComponent,
    NgForOf,
    FooterComponent
  ],
  styleUrls: ['./courses-details.component.css']
})
export class CourseDetailsComponent implements OnInit, OnDestroy {
  course: CourseResponseDto | null = null;
  relatedCourses: CourseResponseDto[] = [];
  isLoading = true;
  isEnrolling = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const courseId = params.get('courseId');
      console.log('Calling courseService.getCourseById with ID:', courseId);
      if (courseId) {
        this.loadCourse(courseId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCourse(courseId: string): void {
    this.isLoading = true;
    this.error = null;

    this.courseService.getCourseById(courseId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (course) => {
        this.course = course;
        this.isLoading = false;
        this.loadRelatedCourses();
        this.scrollToTop();
      },
      error: (error) => {
        this.error = 'Failed to load course details. Please try again.';
        this.isLoading = false;
        console.error('Error loading course:', error);
      }
    });
  }

  private loadRelatedCourses(): void {
    if (!this.course?.category) return;

    this.courseService.getCoursesWithFilters({
      category: this.course.category,
      limit: 4
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (courses) => {
        // Filter out current course and limit to 3 related courses
        this.relatedCourses = courses
          .filter(course => course.id !== this.course?.id)
          .slice(0, 3);
      },
      error: (error) => {
        console.error('Error loading related courses:', error);
      }
    });
  }

  onEnrollClick(): void {
    if (!this.course) return;

    this.isEnrolling = true;

    // Simulate enrollment process
    setTimeout(() => {
      this.isEnrolling = false;
      this.router.navigate(['/enrollment', this.course?.id]);
    }, 1500);
  }

  onBackClick(): void {
    this.router.navigate(['/courses']);
  }

  onRelatedCourseClick(courseId: string): void {
    this.router.navigate(['/course-details', courseId]);
  }

  getDifficultyColorClass(difficulty: string): string {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'text-green-600 bg-green-100';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100';
      case 'advanced':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  getCourseImage(course: CourseResponseDto): string {
    return course.image || '/assets/images/default-course.jpg';
  }

  getInstructorName(course: CourseResponseDto): string {
    return course.instructor?.name || 'Unknown Instructor';
  }

  formatDate(dateInput: Date | string): string {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  isNewCourse(course: CourseResponseDto): boolean {
    if (!course.createdAt) return false;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(course.createdAt) > thirtyDaysAgo;
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  getLessonCount(): number {
    return this.course?.lessons?.length || 12;
  }

  getEstimatedDuration(): string {
    // Calculate based on lessons or return mock data
    const lessons = this.getLessonCount();
    const hours = Math.ceil(lessons * 0.5); // Assume 30 minutes per lesson
    return `${hours} hours`;
  }

  getCourseModules(): any[] {
    // Return mock modules or actual course modules
    return [
      { title: 'Introduction to the Course', lessons: 3, duration: '45 min' },
      { title: 'Core Concepts', lessons: 4, duration: '2 hours' },
      { title: 'Practical Applications', lessons: 3, duration: '1.5 hours' },
      { title: 'Advanced Topics', lessons: 2, duration: '1 hour' }
    ];
  }

  getWhatYouWillLearn(): string[] {
    // Return mock learning outcomes or actual course outcomes
    return [
      'Master the fundamental concepts and principles',
      'Apply theoretical knowledge to practical scenarios',
      'Develop problem-solving skills in real-world contexts',
      'Build confidence through hands-on exercises',
      'Prepare for advanced topics in the field'
    ];
  }

  getCourseRequirements(): string[] {
    // Return mock requirements or actual course requirements
    return [
      'Basic computer literacy',
      'Access to a computer with internet connection',
      'Willingness to learn and practice',
      'No prior experience required'
    ];
  }
}
