import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-course-header',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink
  ],
  templateUrl: './course-header.component.html',
  styleUrl: './course-header.component.css'
})
export class CourseHeaderComponent {
  courses = [
    {
      title: 'Web Design Fundamentals',
      description: 'Learn the fundamentals of web design, including HTML, CSS, and responsive design principles. This course will help you create beautiful, modern websites.',
      category: 'Design',
      level: 'Beginner',
      instructor: 'Jane Smith',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
    },
    {
      title: 'UI/UX Design',
      description: 'Master the art of creating intuitive user interfaces and exceptional user experiences. Learn design thinking, prototyping, and user research.',
      category: 'Design',
      level: 'Intermediate',
      instructor: 'Emily Johnson',
      image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=300&fit=crop'
    },
    {
      title: 'Mobile App Development',
      description: 'Build native mobile apps for iOS and Android. Learn Swift, Kotlin, and cross-platform development frameworks.',
      category: 'Development',
      level: 'Advanced',
      instructor: 'David Brown',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop'
    },
    {
      title: 'Graphic Design for Beginners',
      description: 'Learn essential graphic design skills including typography, color theory, and design composition using Adobe Creative Suite.',
      category: 'Design',
      level: 'Beginner',
      instructor: 'Sarah Thompson',
      image: 'https://images.unsplash.com/photo-1558618666-e83ac0c2cd08?w=400&h=300&fit=crop'
    },
    {
      title: 'Front-End Web Development',
      description: 'Become a front-end developer by learning HTML, CSS, JavaScript, and popular frameworks like React and Angular.',
      category: 'Development',
      level: 'Intermediate',
      instructor: 'Michael Adams',
      image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=300&fit=crop'
    },
    {
      title: 'Advanced JavaScript',
      description: 'Take your JavaScript skills to the next level. Explore advanced concepts, ES6 features, and modern development practices.',
      category: 'Development',
      level: 'Advanced',
      instructor: 'Jennifer Wilson',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop'
    }
  ];
}
