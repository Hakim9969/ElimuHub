import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent {
  stats = [
    { number: '25+', label: 'Instructors Joined Us' },
    { number: '10+', label: 'Active users' },
    { number: '15+', label: 'Courses we have created' },
    { number: '150+', label: 'Students we have trained' }
  ];
}
