import {Component, OnInit} from '@angular/core';
// import {finalize} from 'rxjs/operators';
// import {CategoryResponseDto, CourseResponseDto, Difficulty} from '../../../models/course.model';
// import {CourseService} from '../../services/course-service';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HeaderComponent} from '../shared/components/header/header.component';
import {HeroComponent} from './components/hero/hero.component';
import {CategoriesComponent} from './components/categories/categories.component';
import {StatisticsComponent} from './components/statistics/statistics.component';
import {TestimonialsComponent} from './components/testimonials/testimonials.component';
import {FooterComponent} from '../shared/components/footer/footer.component';
import {CourseHeaderComponent} from './components/course-header/course-header.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent,
    HeroComponent,
    CategoriesComponent,
    StatisticsComponent,
    TestimonialsComponent,
    FooterComponent, CourseHeaderComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {


//   courses: CourseResponseDto[] = [];
//   categories: CategoryResponseDto[] = [];
//   featuredCourses: CourseResponseDto[] = [];
//
//   // Loading states
//   coursesLoading = false;
//   categoriesLoading = false;
//   featuredCoursesLoading = false;
//
//   // Error states
//   coursesError: string | null = null;
//   categoriesError: string | null = null;
//   featuredCoursesError: string | null = null;
//
//   constructor(private courseService: CourseService) {}
//
//   ngOnInit(): void {
//     this.fetchCourses();
//     this.fetchCategories();
//     this.fetchFeaturedCourses();
//   }
//
//   /**
//    * Fetch all courses
//    */
//   fetchCourses(): void {
//     this.coursesLoading = true;
//     this.coursesError = null;
//
//     this.courseService.getCourses()
//       .pipe(
//         finalize(() => this.coursesLoading = false)
//       )
//       .subscribe({
//         next: (data) => {
//           this.courses = data;
//           console.log('Courses fetched successfully:', data);
//         },
//         error: (error) => {
//           console.error('Error fetching courses:', error);
//           this.coursesError = 'Failed to load courses. Please try again later.';
//         }
//       });
//   }
//
//   /**
//    * Fetch categories
//    */
//   fetchCategories(): void {
//     this.categoriesLoading = true;
//     this.categoriesError = null;
//
//     this.courseService.getCategories()
//       .pipe(
//         finalize(() => this.categoriesLoading = false)
//       )
//       .subscribe({
//         next: (data) => {
//           this.categories = data;
//           console.log('Categories fetched successfully:', data);
//         },
//         error: (error) => {
//           console.error('Error fetching categories:', error);
//           this.categoriesError = 'Failed to load categories. Please try again later.';
//         }
//       });
//   }
//
//   /**
//    * Fetch featured courses
//    */
//   fetchFeaturedCourses(): void {
//     this.featuredCoursesLoading = true;
//     this.featuredCoursesError = null;
//
//     this.courseService.getFeaturedCourses()
//       .pipe(
//         finalize(() => this.featuredCoursesLoading = false)
//       )
//       .subscribe({
//         next: (data) => {
//           this.featuredCourses = data;
//           console.log('Featured courses fetched successfully:', data);
//         },
//         error: (error) => {
//           console.error('Error fetching featured courses:', error);
//           this.featuredCoursesError = 'Failed to load featured courses. Please try again later.';
//           // Fallback to regular courses if featured courses fail
//           this.featuredCourses = this.courses.slice(0, 6);
//         }
//       });
//   }
//
//   /**
//    * Get courses by category
//    */
//   getCoursesByCategory(category: string): void {
//     this.coursesLoading = true;
//     this.coursesError = null;
//
//     this.courseService.getCoursesByCategory(category)
//       .pipe(
//         finalize(() => this.coursesLoading = false)
//       )
//       .subscribe({
//         next: (data) => {
//           this.courses = data;
//           console.log(`Courses for category ${category}:`, data);
//         },
//         error: (error) => {
//           console.error(`Error fetching courses for category ${category}:`, error);
//           this.coursesError = 'Failed to load courses for this category.';
//         }
//       });
//   }
//
//   /**
//    * Search courses
//    */
//   searchCourses(query: string): void {
//     if (!query.trim()) {
//       this.fetchCourses();
//       return;
//     }
//
//     this.coursesLoading = true;
//     this.coursesError = null;
//
//     this.courseService.searchCourses(query)
//       .pipe(
//         finalize(() => this.coursesLoading = false)
//       )
//       .subscribe({
//         next: (data) => {
//           this.courses = data;
//           console.log(`Search results for "${query}":`, data);
//         },
//         error: (error) => {
//           console.error(`Error searching courses for "${query}":`, error);
//           this.coursesError = 'Failed to search courses. Please try again.';
//         }
//       });
//   }
//
//   /**
//    * Get courses by difficulty
//    */
//   getCoursesByDifficulty(event: Event): void {
//     const selectElement = event.target as HTMLSelectElement;
//     const value = selectElement.value as Difficulty | '';
//
//     // If "All Levels" is selected (empty string), fetch all courses
//     if (!value) {
//       this.fetchCourses();
//       return;
//     }
//
//     // Ensure the value is a valid Difficulty enum
//     if (Object.values(Difficulty).includes(value)) {
//       this.coursesLoading = true;
//       this.coursesError = null;
//
//       this.courseService.getCoursesByDifficulty(value)
//         .pipe(
//           finalize(() => this.coursesLoading = false)
//         )
//         .subscribe({
//           next: (data) => {
//             this.courses = data;
//             console.log(`Courses for difficulty ${value}:`, data);
//           },
//           error: (error) => {
//             console.error(`Error fetching courses for difficulty ${value}:`, error);
//             this.coursesError = 'Failed to load courses for this difficulty level.';
//           }
//         });
//     } else {
//       console.warn(`Invalid difficulty value: ${value}`);
//       this.coursesError = 'Invalid difficulty selected.';
//     }
//   }
//
//   /**
//    * Retry fetching data
//    */
//
//
//   /**
//    * Retry fetching data
//    */
//   retryFetch(): void {
//     this.fetchCourses();
//     this.fetchCategories();
//     this.fetchFeaturedCourses();
//   }
//
//   /**
//    * Handle course card click
//    */
//   onCourseClick(course: CourseResponseDto): void {
//     console.log('Course clicked:', course);
//     // Navigate to course detail page
//     // this.router.navigate(['/courses', course.id]);
//   }
//
//   /**
//    * Handle category click
//    */
//   onCategoryClick(category: CategoryResponseDto): void {
//     console.log('Category clicked:', category);
//     this.getCoursesByCategory(category.name);
//   }
//
//   /**
//    * Get display image for course
//    */
//   getCourseImage(course: CourseResponseDto): string {
//     return course.image || '/assets/images/default-course.jpg';
//   }
//
//   /**
//    * Get difficulty color class
//    */
//   getDifficultyColorClass(difficulty: Difficulty): string {
//     switch (difficulty) {
//       case Difficulty.BEGINNER:
//         return 'text-green-600';
//       case Difficulty.INTERMEDIATE:
//         return 'text-yellow-600';
//       case Difficulty.ADVANCED:
//         return 'text-red-600';
//       default:
//         return 'text-gray-600';
//     }
//   }
//
//   /**
//    * Format date for display
//    */
//   formatDate(date: Date): string {
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   }
//
//   /**
//    * Get instructor name
//    */
//   getInstructorName(course: CourseResponseDto): string {
//     return course.instructor?.name || 'Unknown Instructor';
//   }
//
//   /**
//    * Check if course is new (created within last 30 days)
//    */
//   isNewCourse(course: CourseResponseDto): boolean {
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
//     return new Date(course.createdAt) > thirtyDaysAgo;
//   }
//
}
