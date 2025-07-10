import {Component, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModuleDto} from '../../../models/course.model';
import {LearningService} from '../../services/learning.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-next-module-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './next-module-button.component.html',
  styleUrl: './next-module-button.component.css'
})
export class NextModuleButtonComponent implements OnInit, OnDestroy {
  nextModule: ModuleDto | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private learningService: LearningService) {}

  ngOnInit() {
    // Subscribe to current module changes and update next module accordingly
    this.subscription.add(
      this.learningService.currentModule$.subscribe(currentModule => {
        this.updateNextModule();
      })
    );

    // Also subscribe to current course changes in case the course changes
    this.subscription.add(
      this.learningService.currentCourse$.subscribe(course => {
        this.updateNextModule();
      })
    );

    // Initial calculation
    this.updateNextModule();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private updateNextModule() {
    this.nextModule = this.learningService.getNextModule();
  }

  goToNextModule() {
    if (this.nextModule) {
      this.learningService.setCurrentModule(this.nextModule);
      // The next module will be recalculated automatically due to the subscription
    }
  }
}
