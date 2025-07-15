import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { DatabaseConfig } from '../../services/database.service';

@Component({
  selector: 'app-database-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './database-config.component.html',
  styleUrls: ['./database-config.component.css']
})
export class DatabaseConfigComponent implements OnInit {
  selectedDatabase: string = 'localStorage';
  connectionStatus: boolean | null = null;
  currentConfig: DatabaseConfig | null = null;

  // Database-specific URLs
  jsonServerUrl: string = 'http://localhost:3000';
  firebaseUrl: string = 'https://your-project.firebaseio.com';
  mongodbUrl: string = 'http://localhost:5000/api';
  mysqlUrl: string = 'http://localhost:8000/api';
  postgresqlUrl: string = 'http://localhost:8000/api';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadCurrentConfiguration();
  }

  loadCurrentConfiguration() {
    this.currentConfig = this.userService.getDatabaseConfig();
    if (this.currentConfig) {
      this.selectedDatabase = this.currentConfig.type;
      
      // Load saved URLs
      if (this.currentConfig.url) {
        switch (this.currentConfig.type) {
          case 'jsonServer':
            this.jsonServerUrl = this.currentConfig.url;
            break;
          case 'firebase':
            this.firebaseUrl = this.currentConfig.url;
            break;
          case 'mongodb':
            this.mongodbUrl = this.currentConfig.url;
            break;
          case 'mysql':
            this.mysqlUrl = this.currentConfig.url;
            break;
          case 'postgresql':
            this.postgresqlUrl = this.currentConfig.url;
            break;
        }
      }
    }
  }

  testConnection() {
    this.connectionStatus = null;
    
    const config = this.buildConfiguration();
    this.userService.configureDatabase(config);
    
    this.userService.testDatabaseConnection().subscribe({
      next: (success) => {
        this.connectionStatus = success;
        if (success) {
          console.log('Database connection test successful');
        } else {
          console.log('Database connection test failed');
        }
      },
      error: (error) => {
        this.connectionStatus = false;
        console.error('Database connection test error:', error);
      }
    });
  }

  saveConfiguration() {
    const config = this.buildConfiguration();
    this.userService.configureDatabase(config);
    this.currentConfig = config;
    
    alert('Database configuration saved successfully!');
    console.log('Database configuration saved:', config);
  }

  private buildConfiguration(): DatabaseConfig {
    const config: DatabaseConfig = {
      type: this.selectedDatabase as any
    };

    switch (this.selectedDatabase) {
      case 'jsonServer':
        config.url = this.jsonServerUrl;
        break;
      case 'firebase':
        config.url = this.firebaseUrl;
        break;
      case 'mongodb':
        config.url = this.mongodbUrl;
        break;
      case 'mysql':
        config.url = this.mysqlUrl;
        break;
      case 'postgresql':
        config.url = this.postgresqlUrl;
        break;
    }

    return config;
  }

  getDatabaseSetupInstructions(): string {
    switch (this.selectedDatabase) {
      case 'jsonServer':
        return `
          To set up JSON Server:
          1. Install: npm install -g json-server
          2. Create db.json file with: {"users": []}
          3. Run: json-server --watch db.json --port 3000
        `;
      case 'firebase':
        return `
          To set up Firebase:
          1. Create Firebase project at firebase.google.com
          2. Enable Realtime Database
          3. Update security rules
          4. Copy project URL
        `;
      case 'mongodb':
        return `
          To set up MongoDB:
          1. Install MongoDB
          2. Create backend API with Express.js
          3. Set up user routes
          4. Configure CORS
        `;
      case 'mysql':
        return `
          To set up MySQL:
          1. Install MySQL server
          2. Create database and users table
          3. Create backend API with Express.js
          4. Set up user routes
        `;
      case 'postgresql':
        return `
          To set up PostgreSQL:
          1. Install PostgreSQL
          2. Create database and users table
          3. Create backend API with Express.js
          4. Set up user routes
        `;
      default:
        return 'No setup required for Local Storage.';
    }
  }
}
