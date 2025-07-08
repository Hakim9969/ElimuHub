import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ✅ Add this import
import { CourseResponseDto, CategoryResponseDto } from '../../../models/course.model';
import { CourseService } from '../../services/course.service';
import { UserResponse } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // ✅ Add FormsModule here
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})

export class AdminDashboardComponent implements OnInit {
  courses: CourseResponseDto[] = [];
  categories: CategoryResponseDto[] = [];
  users: UserResponse[] = [];
  availableRoles: string[] = [];
  categorySectionExpanded = false;

  constructor(private courseService: CourseService, private userService: UserService,  private router: Router) {}

  ngOnInit(): void {
    this.loadCourses();
    this.loadCategories();
    this.loadUsers();
    this.loadRoles();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe((res) => (this.courses = res));
  }

  deleteCourse(id: string) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          this.loadCourses(); // reload the list
          window.location.reload();
        },
        error: (err) => console.error('Failed to delete course', err)
      });
    }
  }

  loadCategories() {
    this.courseService.getCategories().subscribe((res) => (this.categories = res));
  }

  deleteCategory(name: string) {
    if (confirm(`Delete category "${name}"?`)) {
      this.courseService.deleteCategory(name).subscribe({
        next: () => {
          this.loadCategories();
          window.location.reload();
        },
        error: (err) => console.error('Failed to delete category', err)
      });
    }
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res.users;
        console.log('Users loaded:', this.users);
      },
      error: (err) => console.error('Failed to load users', err)
    });
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => console.error('Failed to delete user', err)
      });
    }
  }

  // Enhanced onRoleChange method with detailed debugging
  onRoleChange(userId: string, newRole: string) {
    console.log('Role change attempted:', { userId, newRole, type: typeof newRole });

    // More comprehensive role validation
    const validRoles = ['ADMIN', 'INSTRUCTOR', 'STUDENT'];
    if (!validRoles.includes(newRole)) {
      console.error('Invalid role:', newRole, 'Valid roles:', validRoles);
      alert(`Invalid role: ${newRole}. Valid roles are: ${validRoles.join(', ')}`);
      return;
    }

    // Log the exact payload being sent
    const updatePayload = { role: newRole as 'ADMIN' | 'INSTRUCTOR' | 'STUDENT' };
    console.log('Update payload:', updatePayload);

    this.userService.updateUser(userId, updatePayload).subscribe({
      next: (response) => {
        console.log('Role update successful:', response);
        const user = this.users.find(u => u.id === userId);
        if (user) {
          user.role = newRole as 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
          user.updated = true;

          // Remove "Updated" after 2 seconds
          setTimeout(() => user.updated = false, 2000);
        }
      },
      error: (err) => {
        console.error('Role update failed:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          error: err.error
        });

        // More specific error handling
        if (err.status === 400) {
          alert('Bad request: Invalid role or user data');
        } else if (err.status === 403) {
          alert('Forbidden: You may not have permission to assign this role');
        } else if (err.status === 404) {
          alert('User not found');
        } else {
          alert(`Failed to update role: ${err.message || 'Unknown error'}`);
        }

        // Revert the select to original value
        this.loadUsers();
      }
    });
  }

  // Alternative method to test role updates individually
  testRoleUpdate(userId: string, role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT') {
    console.log(`Testing ${role} role update for user ${userId}`);

    this.userService.updateUser(userId, { role }).subscribe({
      next: (response) => {
        console.log(`${role} update successful:`, response);
      },
      error: (err) => {
        console.error(`${role} update failed:`, err);
      }
    });
  }

  // Enhanced loadRoles method to verify available roles
  loadRoles() {
    this.userService.getUserRoles().subscribe({
      next: (res) => {
        console.log('Available roles from backend:', res);
        this.availableRoles = res.roles;

        // Verify STUDENT is in the available roles
        if (!this.availableRoles.includes('STUDENT')) {
          console.warn('STUDENT role not found in available roles!');
        }
      },
      error: (err) => {
        console.error('Failed to load roles', err);
        // Fallback roles if API fails
        this.availableRoles = ['ADMIN', 'INSTRUCTOR', 'STUDENT'];
      }
    });
  }

  updateRole(userId: string, newRole: string) {
    this.userService.updateUser(userId, { role: newRole as 'ADMIN' | 'INSTRUCTOR' | 'STUDENT'}).subscribe({
      next: () => {
        console.log('User role updated successfully');
        this.loadUsers();
      },
      error: (err) => console.error('Failed to update user role', err)
    });
  }

  // New method to get user count by role for analytics
  getUserCountByRole(role: string): number {
    if (!this.users || this.users.length === 0) {
      return 0;
    }
    return this.users.filter(user => user.role === role).length;
  }

  goToLandingPage(): void {
  this.router.navigate(['/landing']);
}

}
