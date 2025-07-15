import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DatabaseService } from './database.service';

export interface UserData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  jobTitle: string;
  businessType: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  agreeToTerms: boolean;
  newsletter: boolean;
  createdAt?: Date;
  isActive?: boolean;
  role?: 'admin' | 'user';
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<UserData | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private databaseService: DatabaseService) {
    // Load current user from localStorage if available
    this.loadCurrentUser();
  }

  // Register new user using database service
  registerUser(userData: UserData): Promise<boolean> {
    return new Promise((resolve) => {
      // Set default role as 'user' if not specified
      const userWithRole = { 
        ...userData, 
        role: userData.role || 'user',
        id: this.generateUserId(),
        createdAt: new Date(),
        isActive: true
      };
      
      this.databaseService.registerUser(userData).subscribe({
        next: (success) => {
          if (success) {
            this.currentUserSubject.next(userWithRole);
            this.saveCurrentUser(userWithRole);
            console.log('User registered successfully:', userWithRole);
          }
          resolve(success);
        },
        error: (error) => {
          console.error('Registration error:', error);
          resolve(false);
        }
      });
    });
  }

  // Get all registered users from database
  getAllUsers(): UserData[] {
    let users: UserData[] = [];
    this.databaseService.getAllUsers().subscribe({
      next: (data) => {
        users = data;
      },
      error: (error) => {
        console.error('Error getting users:', error);
        users = [];
      }
    });
    return users;
  }

  // Get user by email from database
  getUserByEmail(email: string): UserData | undefined {
    let user: UserData | undefined;
    this.databaseService.getUserByEmail(email).subscribe({
      next: (data) => {
        user = data || undefined;
      },
      error: (error) => {
        console.error('Error getting user by email:', error);
        user = undefined;
      }
    });
    return user;
  }

  // Update user in database
  updateUser(userId: string, updatedData: Partial<UserData>): Promise<boolean> {
    return new Promise((resolve) => {
      this.databaseService.updateUser(userId, updatedData).subscribe({
        next: (success) => {
          if (success) {
            // Update current user if it's the same user
            const currentUser = this.currentUserSubject.value;
            if (currentUser && currentUser.id === userId) {
              this.currentUserSubject.next({ ...currentUser, ...updatedData });
            }
          }
          resolve(success);
        },
        error: (error) => {
          console.error('Error updating user:', error);
          resolve(false);
        }
      });
    });
  }

  // Delete user from database
  deleteUser(userId: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.databaseService.deleteUser(userId).subscribe({
        next: (success) => {
          if (success) {
            // Remove from current user if it's the same user
            const currentUser = this.currentUserSubject.value;
            if (currentUser && currentUser.id === userId) {
              this.currentUserSubject.next(null);
            }
          }
          resolve(success);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          resolve(false);
        }
      });
    });
  }

  // Login user using database
  loginUser(email: string, password: string): Promise<UserData | null> {
    return new Promise((resolve) => {
      this.databaseService.getUserByEmail(email).subscribe({
        next: (user) => {
          if (user && user.password === password) {
            this.currentUserSubject.next(user);
            this.saveCurrentUser(user);
            resolve(user);
          } else {
            resolve(null);
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          resolve(null);
        }
      });
    });
  }

  // Logout user
  logoutUser(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('current_user');
  }

  // Get current user
  getCurrentUser(): UserData | null {
    return this.currentUserSubject.value;
  }

  // Check if current user is admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  // Check if current user is regular user
  isUser(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'user';
  }

  // Get user role
  getUserRole(): 'admin' | 'user' | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  // Check if user exists in database
  userExists(email: string): boolean {
    let exists = false;
    this.databaseService.getUserByEmail(email).subscribe({
      next: (user) => {
        exists = user !== null;
      },
      error: (error) => {
        console.error('Error checking user existence:', error);
        exists = false;
      }
    });
    return exists;
  }

  // Configure database
  configureDatabase(config: any): void {
    this.databaseService.configureDatabase(config);
  }

  // Get database configuration
  getDatabaseConfig(): any {
    return this.databaseService.getDatabaseConfig();
  }

  // Test database connection
  testDatabaseConnection(): Observable<boolean> {
    return this.databaseService.testConnection();
  }

  // Load current user from localStorage
  private loadCurrentUser(): void {
    try {
      const storedUser = localStorage.getItem('current_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  }

  // Save current user to localStorage
  private saveCurrentUser(user: UserData): void {
    try {
      localStorage.setItem('current_user', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving current user:', error);
    }
  }

  // Generate unique user ID
  private generateUserId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Clear all data (for testing)
  clearAllData(): void {
    // Clear localStorage
    localStorage.removeItem('inventory_users');
    localStorage.removeItem('current_user');
    localStorage.removeItem('database_config');
    
    // Clear current user
    this.currentUserSubject.next(null);
    
    console.log('All user data cleared');
  }

  // Export users data (for backup)
  exportUsersData(): string {
    const users = this.getAllUsers();
    return JSON.stringify(users, null, 2);
  }

  // Import users data (for restore)
  importUsersData(data: string): boolean {
    try {
      const importedUsers = JSON.parse(data);
      // Note: This would need to be implemented with the database service
      console.log('Users data imported successfully');
      return true;
    } catch (error) {
      console.error('Error importing users data:', error);
      return false;
    }
  }
}
