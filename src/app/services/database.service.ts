import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserData } from './user.service';

export interface DatabaseConfig {
  type: 'localStorage' | 'jsonServer' | 'firebase' | 'mongodb' | 'mysql' | 'postgresql';
  url?: string;
  apiKey?: string;
  projectId?: string;
  connectionString?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private config: DatabaseConfig = {
    type: 'localStorage' // Default to localStorage
  };

  // API endpoints for different database types
  private readonly API_ENDPOINTS = {
    jsonServer: 'http://localhost:3000',
    firebase: 'https://your-project.firebaseio.com',
    mongodb: 'http://localhost:5000/api',
    mysql: 'http://localhost:8000/api',
    postgresql: 'http://localhost:8000/api'
  };

  constructor(private http: HttpClient) {
    this.loadDatabaseConfig();
  }

  // Configure database connection
  configureDatabase(config: DatabaseConfig): void {
    this.config = config;
    localStorage.setItem('database_config', JSON.stringify(config));
    console.log('Database configured:', config.type);
  }

  // Get current database configuration
  getDatabaseConfig(): DatabaseConfig {
    return this.config;
  }

  // Load database configuration from localStorage
  private loadDatabaseConfig(): void {
    const savedConfig = localStorage.getItem('database_config');
    if (savedConfig) {
      this.config = JSON.parse(savedConfig);
    }
  }

  // User Registration - Store user data in database
  registerUser(userData: UserData): Observable<boolean> {
    switch (this.config.type) {
      case 'localStorage':
        return this.registerUserLocalStorage(userData);
      case 'jsonServer':
        return this.registerUserJsonServer(userData);
      case 'firebase':
        return this.registerUserFirebase(userData);
      case 'mongodb':
        return this.registerUserMongoDB(userData);
      case 'mysql':
        return this.registerUserMySQL(userData);
      case 'postgresql':
        return this.registerUserPostgreSQL(userData);
      default:
        return of(false);
    }
  }

  // Get all users from database
  getAllUsers(): Observable<UserData[]> {
    switch (this.config.type) {
      case 'localStorage':
        return this.getAllUsersLocalStorage();
      case 'jsonServer':
        return this.getAllUsersJsonServer();
      case 'firebase':
        return this.getAllUsersFirebase();
      case 'mongodb':
        return this.getAllUsersMongoDB();
      case 'mysql':
        return this.getAllUsersMySQL();
      case 'postgresql':
        return this.getAllUsersPostgreSQL();
      default:
        return of([]);
    }
  }

  // Get user by email
  getUserByEmail(email: string): Observable<UserData | null> {
    switch (this.config.type) {
      case 'localStorage':
        return this.getUserByEmailLocalStorage(email);
      case 'jsonServer':
        return this.getUserByEmailJsonServer(email);
      case 'firebase':
        return this.getUserByEmailFirebase(email);
      case 'mongodb':
        return this.getUserByEmailMongoDB(email);
      case 'mysql':
        return this.getUserByEmailMySQL(email);
      case 'postgresql':
        return this.getUserByEmailPostgreSQL(email);
      default:
        return of(null);
    }
  }

  // Update user
  updateUser(userId: string, userData: Partial<UserData>): Observable<boolean> {
    switch (this.config.type) {
      case 'localStorage':
        return this.updateUserLocalStorage(userId, userData);
      case 'jsonServer':
        return this.updateUserJsonServer(userId, userData);
      case 'firebase':
        return this.updateUserFirebase(userId, userData);
      case 'mongodb':
        return this.updateUserMongoDB(userId, userData);
      case 'mysql':
        return this.updateUserMySQL(userId, userData);
      case 'postgresql':
        return this.updateUserPostgreSQL(userId, userData);
      default:
        return of(false);
    }
  }

  // Delete user
  deleteUser(userId: string): Observable<boolean> {
    switch (this.config.type) {
      case 'localStorage':
        return this.deleteUserLocalStorage(userId);
      case 'jsonServer':
        return this.deleteUserJsonServer(userId);
      case 'firebase':
        return this.deleteUserFirebase(userId);
      case 'mongodb':
        return this.deleteUserMongoDB(userId);
      case 'mysql':
        return this.deleteUserMySQL(userId);
      case 'postgresql':
        return this.deleteUserPostgreSQL(userId);
      default:
        return of(false);
    }
  }

  // ===== LOCAL STORAGE METHODS =====
  private registerUserLocalStorage(userData: UserData): Observable<boolean> {
    try {
      const users = this.getUsersFromLocalStorage();
      users.push(userData);
      localStorage.setItem('inventory_users', JSON.stringify(users));
      return of(true);
    } catch (error) {
      console.error('LocalStorage registration error:', error);
      return of(false);
    }
  }

  private getAllUsersLocalStorage(): Observable<UserData[]> {
    try {
      const users = this.getUsersFromLocalStorage();
      return of(users);
    } catch (error) {
      console.error('LocalStorage get users error:', error);
      return of([]);
    }
  }

  private getUserByEmailLocalStorage(email: string): Observable<UserData | null> {
    try {
      const users = this.getUsersFromLocalStorage();
      const user = users.find(u => u.email === email);
      return of(user || null);
    } catch (error) {
      console.error('LocalStorage get user error:', error);
      return of(null);
    }
  }

  private updateUserLocalStorage(userId: string, userData: Partial<UserData>): Observable<boolean> {
    try {
      const users = this.getUsersFromLocalStorage();
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...userData };
        localStorage.setItem('inventory_users', JSON.stringify(users));
        return of(true);
      }
      return of(false);
    } catch (error) {
      console.error('LocalStorage update error:', error);
      return of(false);
    }
  }

  private deleteUserLocalStorage(userId: string): Observable<boolean> {
    try {
      const users = this.getUsersFromLocalStorage();
      const filteredUsers = users.filter(u => u.id !== userId);
      localStorage.setItem('inventory_users', JSON.stringify(filteredUsers));
      return of(true);
    } catch (error) {
      console.error('LocalStorage delete error:', error);
      return of(false);
    }
  }

  // ===== JSON SERVER METHODS =====
  private registerUserJsonServer(userData: UserData): Observable<boolean> {
    const url = `${this.API_ENDPOINTS.jsonServer}/users`;
    return this.http.post<UserData>(url, userData).pipe(
      map(() => true),
      catchError(error => {
        console.error('JSON Server registration error:', error);
        return of(false);
      })
    );
  }

  private getAllUsersJsonServer(): Observable<UserData[]> {
    const url = `${this.API_ENDPOINTS.jsonServer}/users`;
    return this.http.get<UserData[]>(url).pipe(
      catchError(error => {
        console.error('JSON Server get users error:', error);
        return of([]);
      })
    );
  }

  private getUserByEmailJsonServer(email: string): Observable<UserData | null> {
    const url = `${this.API_ENDPOINTS.jsonServer}/users?email=${email}`;
    return this.http.get<UserData[]>(url).pipe(
      map(users => users[0] || null),
      catchError(error => {
        console.error('JSON Server get user error:', error);
        return of(null);
      })
    );
  }

  private updateUserJsonServer(userId: string, userData: Partial<UserData>): Observable<boolean> {
    const url = `${this.API_ENDPOINTS.jsonServer}/users/${userId}`;
    return this.http.patch<UserData>(url, userData).pipe(
      map(() => true),
      catchError(error => {
        console.error('JSON Server update error:', error);
        return of(false);
      })
    );
  }

  private deleteUserJsonServer(userId: string): Observable<boolean> {
    const url = `${this.API_ENDPOINTS.jsonServer}/users/${userId}`;
    return this.http.delete(url).pipe(
      map(() => true),
      catchError(error => {
        console.error('JSON Server delete error:', error);
        return of(false);
      })
    );
  }

  // ===== FIREBASE METHODS =====
  private registerUserFirebase(userData: UserData): Observable<boolean> {
    const url = `${this.API_ENDPOINTS.firebase}/users.json`;
    return this.http.post<UserData>(url, userData).pipe(
      map(() => true),
      catchError(error => {
        console.error('Firebase registration error:', error);
        return of(false);
      })
    );
  }

  private getAllUsersFirebase(): Observable<UserData[]> {
    const url = `${this.API_ENDPOINTS.firebase}/users.json`;
    return this.http.get<{ [key: string]: UserData }>(url).pipe(
      map(response => Object.values(response || {})),
      catchError(error => {
        console.error('Firebase get users error:', error);
        return of([]);
      })
    );
  }

  private getUserByEmailFirebase(email: string): Observable<UserData | null> {
    const url = `${this.API_ENDPOINTS.firebase}/users.json?orderBy="email"&equalTo="${email}"`;
    return this.http.get<{ [key: string]: UserData }>(url).pipe(
      map(response => {
        const users = Object.values(response || {});
        return users[0] || null;
      }),
      catchError(error => {
        console.error('Firebase get user error:', error);
        return of(null);
      })
    );
  }

  private updateUserFirebase(userId: string, userData: Partial<UserData>): Observable<boolean> {
    const url = `${this.API_ENDPOINTS.firebase}/users/${userId}.json`;
    return this.http.patch<UserData>(url, userData).pipe(
      map(() => true),
      catchError(error => {
        console.error('Firebase update error:', error);
        return of(false);
      })
    );
  }

  private deleteUserFirebase(userId: string): Observable<boolean> {
    const url = `${this.API_ENDPOINTS.firebase}/users/${userId}.json`;
    return this.http.delete(url).pipe(
      map(() => true),
      catchError(error => {
        console.error('Firebase delete error:', error);
        return of(false);
      })
    );
  }

  // ===== MONGODB METHODS =====
  private registerUserMongoDB(userData: UserData): Observable<boolean> {
    const url = `${this.API_ENDPOINTS.mongodb}/users`;
    return this.http.post<UserData>(url, userData).pipe(
      map(() => true),
      catchError(error => {
        console.error('MongoDB registration error:', error);
        return of(false);
      })
    );
  }

  private getAllUsersMongoDB(): Observable<UserData[]> {
    const url = `${this.API_ENDPOINTS.mongodb}/users`;
    return this.http.get<UserData[]>(url).pipe(
      catchError(error => {
        console.error('MongoDB get users error:', error);
        return of([]);
      })
    );
  }

  private getUserByEmailMongoDB(email: string): Observable<UserData | null> {
    const url = `${this.API_ENDPOINTS.mongodb}/users/email/${email}`;
    return this.http.get<UserData>(url).pipe(
      catchError(error => {
        console.error('MongoDB get user error:', error);
        return of(null);
      })
    );
  }

  private updateUserMongoDB(userId: string, userData: Partial<UserData>): Observable<boolean> {
    const url = `${this.API_ENDPOINTS.mongodb}/users/${userId}`;
    return this.http.put<UserData>(url, userData).pipe(
      map(() => true),
      catchError(error => {
        console.error('MongoDB update error:', error);
        return of(false);
      })
    );
  }

  private deleteUserMongoDB(userId: string): Observable<boolean> {
    const url = `${this.API_ENDPOINTS.mongodb}/users/${userId}`;
    return this.http.delete(url).pipe(
      map(() => true),
      catchError(error => {
        console.error('MongoDB delete error:', error);
        return of(false);
      })
    );
  }

  // ===== MYSQL METHODS =====
  private registerUserMySQL(userData: UserData): Observable<boolean> {
    const url = `${this.API_ENDPOINTS.mysql}/users`;
    return this.http.post<UserData>(url, userData).pipe(
      map(() => true),
      catchError(error => {
        console.error('MySQL registration error:', error);
        return of(false);
      })
    );
  }

  private getAllUsersMySQL(): Observable<UserData[]> {
    const url = `${this.API_ENDPOINTS.mysql}/users`;
    return this.http.get<UserData[]>(url).pipe(
      catchError(error => {
        console.error('MySQL get users error:', error);
        return of([]);
      })
    );
  }

  private getUserByEmailMySQL(email: string): Observable<UserData | null> {
    const url = `${this.API_ENDPOINTS.mysql}/users/email/${email}`;
    return this.http.get<UserData>(url).pipe(
      catchError(error => {
        console.error('MySQL get user error:', error);
        return of(null);
      })
    );
  }

  private updateUserMySQL(userId: string, userData: Partial<UserData>): Observable<boolean> {
    const url = `${this.API_ENDPOINTS.mysql}/users/${userId}`;
    return this.http.put<UserData>(url, userData).pipe(
      map(() => true),
      catchError(error => {
        console.error('MySQL update error:', error);
        return of(false);
      })
    );
  }

  private deleteUserMySQL(userId: string): Observable<boolean> {
    const url = `${this.API_ENDPOINTS.mysql}/users/${userId}`;
    return this.http.delete(url).pipe(
      map(() => true),
      catchError(error => {
        console.error('MySQL delete error:', error);
        return of(false);
      })
    );
  }

  // ===== POSTGRESQL METHODS =====
  private registerUserPostgreSQL(userData: UserData): Observable<boolean> {
    const url = `${this.API_ENDPOINTS.postgresql}/users`;
    return this.http.post<UserData>(url, userData).pipe(
      map(() => true),
      catchError(error => {
        console.error('PostgreSQL registration error:', error);
        return of(false);
      })
    );
  }

  private getAllUsersPostgreSQL(): Observable<UserData[]> {
    const url = `${this.API_ENDPOINTS.postgresql}/users`;
    return this.http.get<UserData[]>(url).pipe(
      catchError(error => {
        console.error('PostgreSQL get users error:', error);
        return of([]);
      })
    );
  }

  private getUserByEmailPostgreSQL(email: string): Observable<UserData | null> {
    const url = `${this.API_ENDPOINTS.postgresql}/users/email/${email}`;
    return this.http.get<UserData>(url).pipe(
      catchError(error => {
        console.error('PostgreSQL get user error:', error);
        return of(null);
      })
    );
  }

  private updateUserPostgreSQL(userId: string, userData: Partial<UserData>): Observable<boolean> {
    const url = `${this.API_ENDPOINTS.postgresql}/users/${userId}`;
    return this.http.put<UserData>(url, userData).pipe(
      map(() => true),
      catchError(error => {
        console.error('PostgreSQL update error:', error);
        return of(false);
      })
    );
  }

  private deleteUserPostgreSQL(userId: string): Observable<boolean> {
    const url = `${this.API_ENDPOINTS.postgresql}/users/${userId}`;
    return this.http.delete(url).pipe(
      map(() => true),
      catchError(error => {
        console.error('PostgreSQL delete error:', error);
        return of(false);
      })
    );
  }

  // Helper methods
  private getUsersFromLocalStorage(): UserData[] {
    const stored = localStorage.getItem('inventory_users');
    return stored ? JSON.parse(stored) : [];
  }

  private generateUserId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Test database connection
  testConnection(): Observable<boolean> {
    switch (this.config.type) {
      case 'localStorage':
        return of(true);
      case 'jsonServer':
        return this.http.get(`${this.API_ENDPOINTS.jsonServer}/users`).pipe(
          map(() => true),
          catchError(() => of(false))
        );
      default:
        return of(false);
    }
  }
}
