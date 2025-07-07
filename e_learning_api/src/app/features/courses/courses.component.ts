import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { CourseResponseDto, Difficulty } from '../../../models/course.model';
import { CourseService } from '../../services/course-service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: CourseResponseDto[] = [];
  coursesLoading = false;
  coursesError: string | null = null;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.fetchCourses();
  }

  fetchCourses(): void {
    this.coursesLoading = true;
    this.coursesError = null;

    this.courseService.getCourses()
      .pipe(finalize(() => this.coursesLoading = false))
      .subscribe({
        next: (data) => {
          this.courses = data;
          console.log('Courses fetched:', data);
        },
        error: (error) => {
          console.error('Error fetching courses:', error);
          this.coursesError = 'Failed to load courses.';
        }
      });
  }

  searchCourses(query: string): void {
    if (!query.trim()) {
      this.fetchCourses();
      return;
    }

    this.coursesLoading = true;
    this.coursesError = null;

    this.courseService.searchCourses(query)
      .pipe(finalize(() => this.coursesLoading = false))
      .subscribe({
        next: (data) => {
          this.courses = data;
          console.log(`Search results for "${query}":`, data);
        },
        error: (error) => {
          console.error(`Error searching courses for "${query}":`, error);
          this.coursesError = 'Failed to search courses.';
        }
      });
  }

  getCoursesByDifficulty(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value as Difficulty;

    if (!value) {
      this.fetchCourses();
      return;
    }

    if (Object.values(Difficulty).includes(value)) {
      this.coursesLoading = true;
      this.coursesError = null;

      this.courseService.getCoursesByDifficulty(value)
        .pipe(finalize(() => this.coursesLoading = false))
        .subscribe({
          next: (data) => {
            this.courses = data;
            console.log(`Courses for difficulty "${value}":`, data);
          },
          error: (error) => {
            console.error(`Error fetching courses for difficulty "${value}":`, error);
            this.coursesError = 'Failed to load difficulty-filtered courses.';
          }
        });
    } else {
      console.warn('Invalid difficulty selected:', value);
    }
  }

  getCourseImage(course: CourseResponseDto): string {
    return course.image || '/assets/images/default-course.jpg';
  }

  getDifficultyColorClass(difficulty: Difficulty): string {
    switch (difficulty) {
      case Difficulty.BEGINNER: return 'text-green-600';
      case Difficulty.INTERMEDIATE: return 'text-yellow-600';
      case Difficulty.ADVANCED: return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getInstructorName(course: CourseResponseDto): string {
    return course.instructor?.name || 'Unknown Instructor';
  }

  isNewCourse(course: CourseResponseDto): boolean {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(course.createdAt) > thirtyDaysAgo;
  }

  onCourseClick(course: CourseResponseDto): void {
    console.log('Course clicked:', course);
    // TODO: Navigate to detail page if needed
  }
}
