import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, UserData } from '../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  userData: UserData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    jobTitle: '',
    businessType: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    agreeToTerms: false,
    newsletter: false
  };

  isSubmitting = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async register() {
    // Validate required fields
    if (!this.userData.firstName || !this.userData.lastName || !this.userData.email || 
        !this.userData.password || !this.userData.confirmPassword) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate password match
    if (this.userData.password !== this.userData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Validate password length
    if (this.userData.password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    // Validate terms agreement
    if (!this.userData.agreeToTerms) {
      alert('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.userData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Check if user already exists
    if (this.userService.userExists(this.userData.email)) {
      alert('A user with this email address already exists. Please use a different email or try logging in.');
      return;
    }

    this.isSubmitting = true;

    try {
      // Register user using the service
      const userDataWithRole = {
        ...this.userData,
        role: 'user' as const // Set default role as user
      };
      
      const success = await this.userService.registerUser(userDataWithRole);
      
      if (success) {
        alert('Account created successfully! Welcome to our platform.');
        this.router.navigate(['/user-dashboard']);
      } else {
        alert('Failed to create account. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }

  goBack() {
    this.router.navigate(['/login']);
  }

  showTerms(event: Event) {
    event.preventDefault();
    alert('Terms of Service: By using our platform, you agree to our terms and conditions...');
  }

  showPrivacy(event: Event) {
    event.preventDefault();
    alert('Privacy Policy: We respect your privacy and will protect your personal information...');
  }
}
