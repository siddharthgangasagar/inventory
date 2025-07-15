# Database Setup Guide for Inventory Management System

This guide will help you set up different database options for storing user registration information.

## 🗄️ Available Database Options

### 1. 📱 Local Storage (Default)
- **Pros**: No setup required, works offline, instant
- **Cons**: Limited storage, device-specific, not shared
- **Best for**: Development, testing, single-user scenarios

### 2. 🔄 JSON Server (Recommended for Development)
- **Pros**: Simple setup, RESTful API, good for prototyping
- **Cons**: Not suitable for production, requires local server
- **Best for**: Development, testing, small teams

### 3. 🔥 Firebase (Recommended for Production)
- **Pros**: Cloud storage, real-time updates, scalable
- **Cons**: Requires Firebase setup, internet connection needed
- **Best for**: Production applications, real-time features

### 4. 🍃 MongoDB
- **Pros**: Scalable NoSQL, flexible schema
- **Cons**: Requires backend setup, more complex
- **Best for**: Large applications, complex data structures

### 5. 🐬 MySQL
- **Pros**: Reliable SQL database, ACID compliance
- **Cons**: Requires backend setup, fixed schema
- **Best for**: Traditional applications, relational data

### 6. 🐘 PostgreSQL
- **Pros**: Advanced SQL features, rich data types
- **Cons**: Requires backend setup, complex configuration
- **Best for**: Complex applications, advanced queries

## 🚀 Quick Setup Instructions

### JSON Server Setup (Easiest)

1. **Install JSON Server globally:**
   ```bash
   npm install -g json-server
   ```

2. **Create a database file (db.json):**
   ```json
   {
     "users": []
   }
   ```

3. **Start the server:**
   ```bash
   json-server --watch db.json --port 3000
   ```

4. **Configure in the app:**
   - Go to Database Config page (⚙️ icon in navbar)
   - Select "JSON Server"
   - Set URL to: `http://localhost:3000`
   - Click "Test Connection" then "Save Configuration"

### Firebase Setup

1. **Create Firebase project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Realtime Database

2. **Get your database URL:**
   - In Firebase Console, go to Realtime Database
   - Copy the database URL (format: `https://your-project.firebaseio.com`)

3. **Configure in the app:**
   - Go to Database Config page
   - Select "Firebase"
   - Paste your database URL
   - Click "Test Connection" then "Save Configuration"

### MongoDB Setup

1. **Install MongoDB:**
   ```bash
   # Windows: Download from mongodb.com
   # macOS: brew install mongodb-community
   # Linux: sudo apt install mongodb
   ```

2. **Create backend API (example with Express.js):**
   ```bash
   mkdir inventory-backend
   cd inventory-backend
   npm init -y
   npm install express cors mongoose
   ```

3. **Create server.js:**
   ```javascript
   const express = require('express');
   const cors = require('cors');
   const mongoose = require('mongoose');
   
   const app = express();
   app.use(cors());
   app.use(express.json());
   
   // Connect to MongoDB
   mongoose.connect('mongodb://localhost:27017/inventory', {
     useNewUrlParser: true,
     useUnifiedTopology: true
   });
   
   // User Schema
   const userSchema = new mongoose.Schema({
     firstName: String,
     lastName: String,
     email: { type: String, unique: true },
     phone: String,
     dateOfBirth: String,
     password: String,
     companyName: String,
     jobTitle: String,
     businessType: String,
     address: String,
     city: String,
     state: String,
     zipCode: String,
     country: String,
     agreeToTerms: Boolean,
     newsletter: Boolean,
     createdAt: { type: Date, default: Date.now },
     isActive: { type: Boolean, default: true }
   });
   
   const User = mongoose.model('User', userSchema);
   
   // Routes
   app.get('/api/users', async (req, res) => {
     try {
       const users = await User.find();
       res.json(users);
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   
   app.post('/api/users', async (req, res) => {
     try {
       const user = new User(req.body);
       await user.save();
       res.status(201).json(user);
     } catch (error) {
       res.status(400).json({ error: error.message });
     }
   });
   
   app.get('/api/users/email/:email', async (req, res) => {
     try {
       const user = await User.findOne({ email: req.params.email });
       res.json(user);
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   
   app.put('/api/users/:id', async (req, res) => {
     try {
       const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
       res.json(user);
     } catch (error) {
       res.status(400).json({ error: error.message });
     }
   });
   
   app.delete('/api/users/:id', async (req, res) => {
     try {
       await User.findByIdAndDelete(req.params.id);
       res.json({ message: 'User deleted' });
     } catch (error) {
       res.status(400).json({ error: error.message });
     }
   });
   
   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```

4. **Start the server:**
   ```bash
   node server.js
   ```

5. **Configure in the app:**
   - Go to Database Config page
   - Select "MongoDB"
   - Set URL to: `http://localhost:5000/api`
   - Click "Test Connection" then "Save Configuration"

### MySQL/PostgreSQL Setup

1. **Install database server:**
   ```bash
   # MySQL
   # Windows: Download MySQL Installer
   # macOS: brew install mysql
   # Linux: sudo apt install mysql-server
   
   # PostgreSQL
   # Windows: Download from postgresql.org
   # macOS: brew install postgresql
   # Linux: sudo apt install postgresql
   ```

2. **Create database and table:**
   ```sql
   -- MySQL
   CREATE DATABASE inventory;
   USE inventory;
   
   CREATE TABLE users (
     id VARCHAR(255) PRIMARY KEY,
     firstName VARCHAR(100) NOT NULL,
     lastName VARCHAR(100) NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     phone VARCHAR(20),
     dateOfBirth DATE,
     password VARCHAR(255) NOT NULL,
     companyName VARCHAR(255),
     jobTitle VARCHAR(100),
     businessType VARCHAR(100),
     address TEXT,
     city VARCHAR(100),
     state VARCHAR(100),
     zipCode VARCHAR(20),
     country VARCHAR(100),
     agreeToTerms BOOLEAN DEFAULT FALSE,
     newsletter BOOLEAN DEFAULT FALSE,
     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     isActive BOOLEAN DEFAULT TRUE
   );
   
   -- PostgreSQL
   CREATE DATABASE inventory;
   \c inventory;
   
   CREATE TABLE users (
     id VARCHAR(255) PRIMARY KEY,
     firstName VARCHAR(100) NOT NULL,
     lastName VARCHAR(100) NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     phone VARCHAR(20),
     dateOfBirth DATE,
     password VARCHAR(255) NOT NULL,
     companyName VARCHAR(255),
     jobTitle VARCHAR(100),
     businessType VARCHAR(100),
     address TEXT,
     city VARCHAR(100),
     state VARCHAR(100),
     zipCode VARCHAR(20),
     country VARCHAR(100),
     agreeToTerms BOOLEAN DEFAULT FALSE,
     newsletter BOOLEAN DEFAULT FALSE,
     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     isActive BOOLEAN DEFAULT TRUE
   );
   ```

3. **Create backend API (similar to MongoDB example but with SQL queries)**

4. **Configure in the app:**
   - Go to Database Config page
   - Select "MySQL" or "PostgreSQL"
   - Set URL to: `http://localhost:8000/api`
   - Click "Test Connection" then "Save Configuration"

## 🔧 Configuration in the App

1. **Access Database Config:**
   - Click the ⚙️ icon in the navbar
   - Or navigate to `/database-config`

2. **Select Database Type:**
   - Choose your preferred database option
   - Fill in the required configuration details

3. **Test Connection:**
   - Click "Test Connection" to verify setup
   - Green checkmark means success

4. **Save Configuration:**
   - Click "Save Configuration" to apply settings
   - Configuration is saved to localStorage

## 📊 Data Migration

When switching between database types:

1. **Export current data:**
   - Go to Admin page
   - Click "Export Users" to download JSON file

2. **Import to new database:**
   - Set up new database
   - Use the export file to populate new database
   - Update configuration in the app

## 🛠️ Troubleshooting

### Common Issues:

1. **Connection Failed:**
   - Check if server is running
   - Verify URL/port is correct
   - Check firewall settings
   - Ensure CORS is enabled (for backend APIs)

2. **Data Not Saving:**
   - Check browser console for errors
   - Verify database permissions
   - Check network connectivity

3. **Performance Issues:**
   - Use appropriate database for your use case
   - Consider indexing for large datasets
   - Monitor connection pooling

### Support:

- **Local Storage**: No setup required, works immediately
- **JSON Server**: Check if port 3000 is available
- **Firebase**: Verify project setup and rules
- **MongoDB/MySQL/PostgreSQL**: Check server logs and connection strings

## 🎯 Recommendations

- **Development**: Use Local Storage or JSON Server
- **Testing**: Use JSON Server for API testing
- **Production**: Use Firebase or MongoDB
- **Enterprise**: Use MySQL or PostgreSQL

Choose the database that best fits your needs in terms of setup complexity, scalability, and features required. 