import {Component, OnInit} from '@angular/core';
import {CourseResponseDto, LessonDto, ModuleDto} from "../../../models/course.model";
import {LearningService} from "../../services/learning.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-module-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './module-list.component.html',
  styleUrl: './module-list.component.css'
})
export class ModuleListComponent implements OnInit {
  course: CourseResponseDto | null = null;
  currentModule: ModuleDto | null = null;
  currentLesson: LessonDto | null = null;
  expandedModules = new Set<string>();

  constructor(private learningService: LearningService) {}

  ngOnInit() {
    this.learningService.currentCourse$.subscribe(course => {
      this.course = course;
      if (course && course.modules.length > 0) {
        this.expandedModules.add(course.modules[0].id);
      }
    });

    this.learningService.currentModule$.subscribe(module => {
      this.currentModule = module;
      if (module) {
        this.expandedModules.add(module.id);
      }
    });

    this.learningService.currentLesson$.subscribe(lesson => {
      this.currentLesson = lesson;
    });
  }

  toggleModule(module: ModuleDto) {
    if (this.expandedModules.has(module.id)) {
      this.expandedModules.delete(module.id);
    } else {
      this.expandedModules.add(module.id);
    }
    this.learningService.setCurrentModule(module);
  }

  selectLesson(lesson: LessonDto) {
    this.learningService.setCurrentLesson(lesson);
  }

  isLessonCompleted(lessonId: string): boolean {
    return this.learningService.isLessonCompleted(lessonId);
  }
}
