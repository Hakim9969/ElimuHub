import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModuleListComponent} from '../module-list/module-list.component';
import {LessonViewerComponent} from '../lesson-viewer/lesson-viewer.component';
import {NextModuleButtonComponent} from '../next-module-button/next-module-button.component';
import {CourseResponseDto, LessonDto} from '../../../models/course.model';
import {ActivatedRoute, Router} from '@angular/router';
import {CourseService} from '../../services/course-service';
import {LearningService} from '../../services/learning.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-learning-platform',
  standalone: true,
  imports: [
    CommonModule,
    ModuleListComponent,
    LessonViewerComponent,
    NextModuleButtonComponent
  ],
  templateUrl: './learning-platform.component.html',
  styleUrl: './learning-platform.component.css'
})
export class LearningPlatformComponent implements OnInit {
  course: CourseResponseDto | null = null;
  currentLesson: LessonDto | null = null;
  error: string | null = null;
  progressPercentage = 0;
  showNextModuleButton = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private learningService: LearningService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadCourse();
    this.setupSubscriptions();
  }

  private setupSubscriptions() {
    this.learningService.currentCourse$.subscribe(course => {
      this.course = course;
      this.calculateProgress();
    });

    this.learningService.currentLesson$.subscribe(lesson => {
      this.currentLesson = lesson;
      this.checkShowNextModuleButton();
    });

    this.learningService.progress$.subscribe(() => {
      this.calculateProgress();
      this.checkShowNextModuleButton();
    });
  }

  protected loadCourse() {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (!courseId) {
      this.error = 'Course ID not found';
      return;
    }

    this.courseService.getCourseById(courseId).subscribe({
      next: (course) => {
        // Add mock data for demonstration
        this.course = this.addMockContent(course);
        this.learningService.setCourse(this.course);
        this.error = null;
      },
      error: (err) => {
        this.error = 'Failed to load course. Please try again.';
        console.error('Error loading course:', err);
      }
    });
  }

  private addMockContent(course: CourseResponseDto): CourseResponseDto {
    // Add mock modules and lessons if they don't exist
    if (!course.modules || course.modules.length === 0) {
      course.modules = [
        {
          id: '1',
          title: 'Introduction to UI/UX Design',
          description: 'Learn the fundamentals of user interface and user experience design',
          order: 1,
          lessons: [
            {
              id: '1-1',
              title: 'Understanding UI/UX Design Principles',
              content: `Welcome to the world of UI/UX design! In this lesson, we'll explore the fundamental principles that guide effective user interface and user experience design.

User Interface (UI) Design focuses on the visual elements of a product - the buttons, icons, spacing, typography, and color schemes. It's about creating interfaces that are not only beautiful but also functional and intuitive.

User Experience (UX) Design is broader, encompassing the entire journey a user takes when interacting with a product. It includes research, wireframing, prototyping, and testing to ensure the product meets user needs and expectations.

Key Principles:
1. Usability - The interface should be easy to use and navigate
2. Consistency - Elements should behave predictably throughout the product
3. Accessibility - Design should be inclusive for all users
4. Visual Hierarchy - Important elements should stand out
5. Feedback - Users should understand the result of their actions

These principles form the foundation of good design and will be referenced throughout this course.`,
              duration: '45 minutes',
              order: 1,
              quiz: {
                id: 'quiz-1-1',
                passingScore: 80,
                questions: [
                  {
                    id: 'q1',
                    question: 'What is the primary focus of UI Design?',
                    type: 'multiple-choice',
                    options: [
                      'User research and testing',
                      'Visual elements and interface layout',
                      'Business strategy and goals',
                      'Technical implementation'
                    ],
                    correctAnswer: 1
                  },
                  {
                    id: 'q2',
                    question: 'UX Design encompasses the entire user journey with a product.',
                    type: 'true-false',
                    options: ['True', 'False'],
                    correctAnswer: 0
                  }
                ]
              }
            },
            {
              id: '1-2',
              title: 'Importance of User-Centered Design',
              content: `User-Centered Design (UCD) is a design philosophy that prioritizes the needs, preferences, and limitations of end users at every stage of the design process.

Why is UCD important?
1. Better User Satisfaction - When products are designed with users in mind, they're more likely to meet their needs and expectations
2. Reduced Development Costs - Identifying and fixing usability issues early is much cheaper than fixing them after launch
3. Increased Adoption - Products that are easy to use are more likely to be adopted and recommended by users
4. Competitive Advantage - Superior user experience can differentiate your product in the market

The UCD Process:
1. Research - Understand your users through interviews, surveys, and observation
2. Define - Create user personas and identify key user needs
3. Design - Develop solutions that address these needs
4. Test - Validate your designs with real users
5. Iterate - Refine based on feedback and testing results

Remember: You are not your user. What seems obvious to you might be confusing to someone else. Always validate your assumptions with real user feedback.`,
              duration: '40 minutes',
              order: 2,
              quiz: {
                id: 'quiz-1-2',
                passingScore: 75,
                questions: [
                  {
                    id: 'q3',
                    question: 'What is the main benefit of identifying usability issues early in the design process?',
                    type: 'multiple-choice',
                    options: [
                      'It makes the design look better',
                      'It reduces development costs',
                      'It speeds up the development process',
                      'It eliminates the need for testing'
                    ],
                    correctAnswer: 1
                  }
                ]
              }
            }
          ]
        },
        {
          id: '2',
          title: 'User Research and Analysis',
          description: 'Learn how to conduct effective user research and analyze findings',
          order: 2,
          lessons: [
            {
              id: '2-1',
              title: 'Conducting User Research and Interviews',
              content: `User research is the foundation of good UX design. It helps you understand your users' needs, behaviors, motivations, and pain points.

Types of User Research:
1. Qualitative Research - In-depth insights into user behavior and motivations
   - User interviews
   - Focus groups
   - Usability testing
   - Ethnographic studies

2. Quantitative Research - Statistical data about user behavior
   - Surveys
   - Analytics
   - A/B testing
   - Heat maps

Conducting User Interviews:
1. Prepare - Define your research goals and prepare questions
2. Recruit - Find representative users from your target audience
3. Interview - Ask open-ended questions and listen actively
4. Document - Record key insights and observations
5. Analyze - Look for patterns and themes across interviews

Best Practices:
- Ask "why" to understand motivations
- Avoid leading questions
- Be comfortable with silence
- Focus on behavior, not opinions
- Record with permission for later analysis`,
              duration: '1 hour',
              order: 1,
              quiz: {
                id: 'quiz-2-1',
                passingScore: 80,
                questions: [
                  {
                    id: 'q4',
                    question: 'Which type of research provides in-depth insights into user behavior?',
                    type: 'multiple-choice',
                    options: [
                      'Quantitative research',
                      'Qualitative research',
                      'Analytics data',
                      'A/B testing'
                    ],
                    correctAnswer: 1
                  }
                ]
              }
            }
          ]
        }
      ];
    }
    return course;
  }

  private calculateProgress() {
    if (!this.course) return;

    const totalLessons = this.course.modules.reduce((total, module) => total + module.lessons.length, 0);
    const completedLessons = this.course.modules.reduce((total, module) => {
      return total + module.lessons.filter(lesson => this.learningService.isLessonCompleted(lesson.id)).length;
    }, 0);

    this.progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  }

  private checkShowNextModuleButton() {
    if (!this.course || !this.currentLesson) return;

    const currentModule = this.course.modules.find(m =>
      m.lessons.some(l => l.id === this.currentLesson?.id)
    );

    if (!currentModule) return;

    const allLessonsCompleted = currentModule.lessons.every(lesson =>
      this.learningService.isLessonCompleted(lesson.id)
    );

    this.showNextModuleButton = allLessonsCompleted && !!this.learningService.getNextModule();
  }

  goBack() {
    this.router.navigate(['/courses']);
  }
}
