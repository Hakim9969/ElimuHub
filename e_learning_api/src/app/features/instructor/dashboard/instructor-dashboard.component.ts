import { Component, OnInit, inject } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { CourseService } from '../../../services/course-service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FormsModule,RouterLink],
  templateUrl: './instructor-dashboard.component.html',
  styleUrls: ['./instructor-dashboard.component.css'],
})
export class InstructorDashboardComponent implements OnInit {
  private courseService = inject(CourseService);

  courses: any[] = [];
  totalStudents = 0;
  totalLessons = 0;
  publishedCourses = 0;

  showAddCourseForm = false;

  newCourse = {
    title: '',
    description: '',
    category: '',
    difficulty: '', // should be a valid enum value
    objectives: '',
    prerequisites: '',
    image: ''
  };

  selectedCourse: any = null;

  ngOnInit() {
    this.fetchCourses();
  }

  get courseFormModel() {
    return this.selectedCourse ?? this.newCourse;
  }

  fetchCourses() {
    this.courseService.getMyCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.publishedCourses = courses.filter(c => c.published).length;
        this.totalLessons = courses.reduce((sum, c) => sum + (c.contents?.length || 0), 0);
        this.totalStudents = courses.reduce((sum, c) => sum + (c.enrollments?.length || 0), 0);
      },
      error: (err) => {
        console.error('Failed to fetch courses', err);
      }
    });
  }

  togglePublish(course: any) {
    const updated = { published: !course.published };
    this.courseService.updateCourse(course.id, updated).subscribe(() => {
      course.published = updated.published;
      this.publishedCourses = this.courses.filter(c => c.published).length;
    });
  }

  addCourse() {
    console.log('Submitting course:', this.newCourse);
    
    // Validate required fields
    const { title, description, category, difficulty } = this.newCourse;
    if (!title || !description || !category || !difficulty) {
      alert('Please fill in all required fields.');
      return;
    }

    if (this.selectedCourse?.id) {
      this.courseService.updateCourse(this.selectedCourse.id, this.selectedCourse).subscribe({
        next: (res) => {
          console.log('Course updated', res);
          this.fetchCourses();
          this.resetForm();
        },
        error: (err) => {
          console.error('Update failed', err);
        }
      });
    } else {
      this.courseService.createCourse(this.newCourse).subscribe({
        next: (res) => {
          console.log('Course created', res);
          this.fetchCourses();
          this.resetForm();
        },
        error: (err) => {
          console.error('Create failed', err);
          alert('Failed to create course: ' + err.error?.message || err.message);
        }
      });
    }
  }

  resetForm() {
    this.showAddCourseForm = false;
    this.newCourse = {
      title: '',
      description: '',
      category: '',
      difficulty: '',
      objectives: '',
      prerequisites: '',
      image: ''
    };
    this.selectedCourse = null;
  }

  editCourse(course: any) {
    this.selectedCourse = { ...course };
    this.showAddCourseForm = true;
  }

  // DELETE COURSE
  deleteCourse(courseId: string): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(courseId).subscribe({
        next: () => {
          this.courses = this.courses.filter(course => course.id !== courseId);
          alert('Course deleted successfully');
        },
        error: (error) => {
          console.error('Delete failed:', error);
          alert('Failed to delete course');
        }
      });
    }
  }
}