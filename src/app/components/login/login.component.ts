import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  isLoggingIn = false;
  showPassword = false;

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    
    // Basic validation
    if (!this.email || !this.password) {
      alert('Please enter both email and password');
      return;
    }
    
    this.isLoggingIn = true;

    try {
      // Check for demo admin account first
      if (this.email === 'admin@example.com' && this.password === 'admin123') {
        // Create demo admin user
        const adminUser = {
          id: 'admin_demo',
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@example.com',
          role: 'admin' as const,
          createdAt: new Date(),
          isActive: true
        };
        
        // Set as current user
        this.userService['currentUserSubject'].next(adminUser);
        this.userService['saveCurrentUser'](adminUser);
        
        alert('Admin login successful! Welcome to the admin dashboard.');
        this.router.navigate(['/admin']);
        return;
      }

      // Try to login with registered users
      const user = await this.userService.loginUser(this.email, this.password);
      
      if (user) {
        alert('Login successful! Welcome back, ' + user.firstName);
        
        // Redirect based on user role
        if (user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user-dashboard']);
        }
        return;
      }

      // Fallback message
      if (this.email === 'admin@example.com') {
        alert('Invalid admin password. Use: admin123');
      } else {
        alert('Invalid email or password. Please check your credentials or try the demo admin account: admin@example.com / admin123');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    } finally {
      this.isLoggingIn = false;
    }
  }

  forgotPassword() {
    const email = prompt('Enter your email address to reset password:');
    if (email) {
      // Check if user exists
      const user = this.userService.getUserByEmail(email);
      if (user) {
        alert(`Password reset link sent to ${email}`);
      } else {
        alert('No account found with this email address.');
      }
    }
  }

  register() {
    this.router.navigate(['/register']);
  }
}
