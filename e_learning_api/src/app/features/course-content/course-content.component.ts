import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { CourseService } from '../../services/course-service';

@Component({
    selector: 'app-course-content',
    standalone: true,
    templateUrl: './course-content.component.html',
    styleUrls: ['./course-content.component.css'],
    imports: [CommonModule, FormsModule]
})
export class CourseContentComponent implements OnInit {
    courseId!: string;
    contents: any[] = [];

    newContent = {
        title: '',
        order: 1
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private contentService: ContentService,
        private courseService: CourseService
    ) { }

    ngOnInit(): void {
        this.courseId = this.route.snapshot.paramMap.get('courseId')!;
        this.fetchContents();
    }

    fetchContents(): void {
        this.contentService.getContents(this.courseId).subscribe({
            next: (data) => (this.contents = data),
            error: (err) => console.error('Error fetching contents', err)
        });
    }

    addContent(): void {
        if (!this.newContent.title) return;

        this.contentService.createContent(this.courseId, this.newContent).subscribe({
            next: () => {
                this.newContent = { title: '', order: this.contents.length + 1 };
                this.fetchContents();
            },
            error: (err) => console.error('Error creating content', err)
        });
    }

    goToLessons(contentId: string) {
        this.router.navigate(['/instructor/course', this.courseId, 'content', contentId, 'lessons']);
    }

}