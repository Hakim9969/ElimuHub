import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CommonModule} from '@angular/common';
import {ModuleListComponent} from './features/module-list/module-list.component';
import {LessonListComponent} from './features/lesson-list/lesson-list.component';
import {LessonViewerComponent} from './features/lesson-viewer/lesson-viewer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule,
    ModuleListComponent,
    LessonListComponent,
    LessonViewerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'e_learning_api';
}
