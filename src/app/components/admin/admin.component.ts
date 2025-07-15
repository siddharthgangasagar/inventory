import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService, UserData } from '../../services/user.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: UserData[] = [];
  selectedUser: UserData | null = null;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if user is admin
    if (!this.userService.isAdmin()) {
      alert('Access denied. Admin privileges required.');
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadUsers();
  }

  loadUsers() {
    // Get users from database
    this.userService.getAllUsers().subscribe({
      next: (users: UserData[]) => {
        this.users = users;
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
        this.users = [];
      }
    });
  }

  get activeUsersCount(): number {
    return this.users.filter(user => user.isActive).length;
  }

  get newsletterSubscribersCount(): number {
    return this.users.filter(user => user.newsletter).length;
  }

  viewUser(user: UserData) {
    this.selectedUser = user;
  }

  closeModal() {
    this.selectedUser = null;
  }

  logout() {
    this.userService.logoutUser();
    alert('You have been logged out successfully.');
    this.router.navigate(['/login']);
  }

  async deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      const success = await this.userService.deleteUser(userId);
      if (success) {
        this.loadUsers();
        alert('User deleted successfully');
      } else {
        alert('Failed to delete user');
      }
    }
  }

  exportData() {
    const data = this.userService.exportUsersData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_data.json';
    a.click();
    window.URL.revokeObjectURL(url);
    alert('User data exported successfully');
  }

  clearAllData() {
    if (confirm('Are you sure you want to clear all user data? This action cannot be undone.')) {
      this.userService.clearAllData();
      this.loadUsers();
      alert('All user data cleared');
    }
  }
}
