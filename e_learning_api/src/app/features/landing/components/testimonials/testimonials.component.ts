import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent {
  testimonials = [
    {
      name: 'Sarah L.',
      role: 'Head of Story',
      content: 'This web design course provided a solid foundation for me. The instructors were knowledgeable and the hands-on projects made learning enjoyable and engaging. Highly recommend it!',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'James W.',
      role: 'Head of Story',
      content: 'The UI/UX design course exceeded my expectations. The instructors were knowledgeable and the projects were practical and relevant. I feel confident in my design skills now.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Anna P.',
      role: 'Head of Story',
      content: 'The mobile app development course was fantastic! The step-by-step approach made complex concepts easy to understand. I built my first app within the first month!',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Michael R.',
      role: 'Head of Story',
      content: 'I enrolled in the graphic design course as a beginner, and I was amazed by how much I learned. The instructor was patient and the curriculum was well-structured.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    }
  ];
}
