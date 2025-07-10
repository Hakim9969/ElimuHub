import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseResponseDto, CategoryResponseDto } from '../../../models/course.model';
import { CourseService } from '../../services/course.service';
import { UserResponse } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  activeTab = 'users';
  courses: CourseResponseDto[] = [];
  categories: CategoryResponseDto[] = [];
  users: UserResponse[] = [];
  availableRoles: string[] = [];

  constructor(
    private courseService: CourseService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loadCourses();
    this.loadCategories();
    this.loadUsers();
    this.loadRoles();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe(
      (res) => (this.courses = res),
      (err) => console.error('Failed to load courses', err)
    );
  }

  loadCategories(): void {
    this.courseService.getCategories().subscribe(
      (res) => (this.categories = res),
      (err) => console.error('Failed to load categories', err)
    );
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res.users;
      },
      error: (err) => console.error('Failed to load users', err)
    });
  }

  loadRoles(): void {
    this.userService.getUserRoles().subscribe({
      next: (res) => {
        this.availableRoles = res.roles;
      },
      error: (err) => {
        console.error('Failed to load roles', err);
        this.availableRoles = ['ADMIN', 'INSTRUCTOR', 'STUDENT'];
      }
    });
  }

  deleteCourse(id: string): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => this.loadCourses(),
        error: (err) => console.error('Failed to delete course', err)
      });
    }
  }

  deleteCategory(name: string): void {
    if (confirm(`Delete category "${name}"?`)) {
      this.courseService.deleteCategory(name).subscribe({
        next: () => this.loadCategories(),
        error: (err) => console.error('Failed to delete category', err)
      });
    }
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Failed to delete user', err)
      });
    }
  }

  onRoleChange(userId: string, newRole: string): void {
    const validRoles = ['ADMIN', 'INSTRUCTOR', 'STUDENT'];
    if (!validRoles.includes(newRole)) {
      alert(`Invalid role: ${newRole}`);
      return;
    }

    this.userService.updateUser(userId, { role: newRole as 'ADMIN' | 'INSTRUCTOR' | 'STUDENT' }).subscribe({
      next: () => {
        const user = this.users.find(u => u.id === userId);
        if (user) {
          user.role = newRole as 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
          user.updated = true;
          setTimeout(() => user.updated = false, 2000);
        }
      },
      error: (err) => {
        console.error('Role update failed:', err);
        alert('Failed to update role');
        this.loadUsers();
      }
    });
  }

  getUserCountByRole(role: string): number {
    return this.users?.filter(user => user.role === role).length || 0;
  }

  goToLandingPage(): void {
    this.router.navigate(['/landing']);
  }
}
