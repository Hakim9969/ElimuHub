import {CommonModule} from '@angular/common';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {Subject, debounceTime, distinctUntilChanged, takeUntil, Observable} from 'rxjs';
import {CourseResponseDto, Difficulty, CategoryResponseDto} from '../../../models/course.model';
import {CourseService, CourseFilters} from '../../services/course-service';
import {AuthService} from '../../services/auth.service';
import {EnrollmentService} from '../../services/enrollment.service';
import {HeaderComponent} from '../shared/components/header/header.component';
import {FooterComponent} from '../shared/components/footer/footer.component';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit, OnDestroy {
  courses: CourseResponseDto[] = [];
  categories: CategoryResponseDto[] = [];
  coursesLoading = false;
  coursesError: string | null = null;

  // Filter properties
  searchQuery = '';
  selectedDifficulty: string = '';
  selectedCategory: string = '';
  showNewOnly = false;

  // Search debouncing
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // Difficulty enum for template
  Difficulty = Difficulty;

  constructor(
    private courseService: CourseService,
    private router: Router,
    private authService: AuthService,
    private enrollmentService: EnrollmentService
  ) {
  }

  ngOnInit(): void {
    this.initializeSearchDebounce();
    this.loadCategories();
    this.applyFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize search with debouncing to avoid too many API calls
   */
  private initializeSearchDebounce(): void {
    this.searchSubject
      .pipe(
        debounceTime(300), // Wait 300ms after user stops typing
        distinctUntilChanged(), // Only trigger if search term actually changed
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.searchQuery = searchTerm;
        this.applyFilters();
      });
  }

  /**
   * Load available categories for filtering
   */
  private loadCategories(): void {
    this.courseService.getCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  /**
   * Handle search input with debouncing
   */
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value.trim());
  }

  /**
   * Handle search when user presses Enter
   */
  onSearchEnter(query: string): void {
    this.searchSubject.next(query.trim());
  }

  /**
   * Handle difficulty filter change
   */
  onDifficultyChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedDifficulty = select.value;
    this.applyFilters();
  }

  /**
   * Handle category filter change
   */
  onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCategory = select.value;
    this.applyFilters();
  }

  /**
   * Handle new courses filter toggle
   */
  onNewCoursesToggle(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.showNewOnly = checkbox.checked;
    this.applyFilters();
  }

  /**
   * Apply all active filters
   */
  applyFilters(): void {
    this.coursesLoading = true;
    this.coursesError = null;

    const filters: CourseFilters = {
      search: this.searchQuery,
      difficulty: this.selectedDifficulty,
      category: this.selectedCategory,
      isNew: this.showNewOnly || undefined
    };

    this.courseService.getCoursesWithFilters(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.courses = data;
          this.coursesLoading = false;
        },
        error: (err) => {
          console.error('Error loading courses:', err);
          this.coursesError = 'Failed to load courses. Please try again.';
          this.coursesLoading = false;
        }
      });
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.searchQuery = '';
    this.selectedDifficulty = '';
    this.selectedCategory = '';
    this.showNewOnly = false;

    // Reset search input
    const searchInput = document.querySelector('#searchInput') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }

    this.applyFilters();
  }

  /**
   * Get course image with fallback
   */
  getCourseImage(course: CourseResponseDto): string {
    return course.image || '/assets/images/default-course.jpg';
  }

  /**
   * Get CSS class for difficulty level
   */
  getDifficultyColorClass(difficulty: Difficulty): string {
    switch (difficulty) {
      case Difficulty.BEGINNER:
        return 'text-green-600';
      case Difficulty.INTERMEDIATE:
        return 'text-yellow-600';
      case Difficulty.ADVANCED:
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }

  /**
   * Format date for display
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Get instructor name with fallback
   */
  getInstructorName(course: CourseResponseDto): string {
    return course.instructor?.name || 'Unknown Instructor';
  }

  /**
   * Check if course is new (within last 30 days)
   */
  isNewCourse(course: CourseResponseDto): boolean {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    return new Date(course.createdAt) > cutoff;
  }

  /**
   * Handle course card click
   */
  onCourseClick(course: CourseResponseDto): void {
    this.router.navigate(['/course-details', course.id]);
  }

  /**
   * Handle enrollment click
   */
  handleEnrollClick(course: CourseResponseDto, event: Event): void {
    event.stopPropagation();

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: {returnUrl: '/courses'}
      });
      return;
    }

    const userId = this.authService.getCurrentUser()?.id;
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }


    this.enrollmentService.enrollUserInCourse(userId, course.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          alert('Successfully enrolled!');
          this.router.navigate(['/enroll/my-courses']);
        },
        error: (error) => {
          if (error.status === 409) {
            alert('You are already enrolled in this course.');
          } else if (error.status === 403) {
            alert('You must complete the prerequisite course first.');
          } else {
            alert('Enrollment failed. Please try again.');
          }
        }
      });
  }

  /**
   * Get available difficulties for dropdown
   */
  getDifficulties(): Difficulty[] {
    return Object.values(Difficulty);
  }
  // getDifficulties(): Difficulty[] {
  //   return this.courseService.getCoursesWithFilters(Difficulty);
  // }

  /**
   * Check if any filters are active
   */
  hasActiveFilters(): boolean {
    return !!(this.searchQuery || this.selectedDifficulty || this.selectedCategory || this.showNewOnly);
  }

}
