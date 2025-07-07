import {Component, OnInit} from '@angular/core';
// import {CategoryResponseDto} from '../../../../models/course.model';
// import {CourseService} from '../../../services/course-service';
// import {finalize} from 'rxjs/operators';
import {NgClass, NgForOf} from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,

  imports: [
    NgClass,
    NgForOf
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent  {//implements OnInit
  categories = [
    {
      name: 'Data Science',
      courses: '11 Courses',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      iconPath: 'M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z'
    },
    {
      name: 'Development',
      courses: '12 Courses',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      iconPath: 'M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z'
    },
    {
      name: 'Marketing',
      courses: '11 Courses',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      name: 'Design',
      courses: '14 Courses',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      iconPath: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5v14a2 2 0 104 0V3z'
    }
  ];
  // categories: CategoryResponseDto[] = [];
  // categoriesLoading = false;
  // categoriesError: string | null = null;
  //
  // ngOnInit(): void {
  //   this.fetchCategories();
  // }
  //
  // constructor(private courseService: CourseService) {}
  //
  // fetchCategories(): void {
  //   this.categoriesLoading = true;
  //   this.categoriesError = null;
  //
  //   this.courseService.getCategories()
  //     .pipe(
  //       finalize(() => this.categoriesLoading = false)
  //     )
  //     .subscribe({
  //       next: (data) => {
  //         this.categories = data;
  //         console.log('Categories fetched successfully:', data);
  //       },
  //       error: (error) => {
  //         console.error('Error fetching categories:', error);
  //         this.categoriesError = 'Failed to load categories. Please try again later.';
  //       }
  //     });
  // }



}
