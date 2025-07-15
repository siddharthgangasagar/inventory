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
      // Try to login with registered users first
      const user = await this.userService.loginUser(this.email, this.password);
      
      if (user) {
        alert('Login successful! Welcome back, ' + user.firstName);
        this.router.navigate(['/home']);
        return;
      }

      // Fallback to demo credentials
      if (this.email === 'admin@example.com' && this.password === 'password') {
        alert('Login successful! (Demo account)');
        this.router.navigate(['/home']);
      } else {
        alert('Invalid email or password. Please check your credentials or try the demo account: admin@example.com / password');
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
