import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModuleDto} from '../../../models/course.model';
import {LearningService} from '../../services/learning.service';

@Component({
  selector: 'app-next-module-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './next-module-button.component.html',
  styleUrl: './next-module-button.component.css'
})
export class NextModuleButtonComponent implements OnInit {
  nextModule: ModuleDto | null = null;

  constructor(private learningService: LearningService) {}

  ngOnInit() {
    this.nextModule = this.learningService.getNextModule();
  }

  goToNextModule() {
    if (this.nextModule) {
      this.learningService.setCurrentModule(this.nextModule);
    }
  }
}
