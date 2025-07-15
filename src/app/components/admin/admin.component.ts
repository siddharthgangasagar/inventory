import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.users = this.userService.getAllUsers();
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
