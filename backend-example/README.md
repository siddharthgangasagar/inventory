# Backend Example for Inventory Management System

This directory contains example backend implementations for different database options.

## Quick Start with JSON Server

### 1. Install Dependencies
```bash
cd backend-example
npm install
```

### 2. Start the Server
```bash
npm start
```

The server will start on `http://localhost:3000`

### 3. Available Endpoints
- `GET /users` - Get all users
- `POST /users` - Create a new user
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /users?email=example@email.com` - Get user by email

### 4. Configure in Angular App
1. Go to Database Config page (⚙️ icon in navbar)
2. Select "JSON Server"
3. Set URL to: `http://localhost:3000`
4. Click "Test Connection" then "Save Configuration"

## Database File Structure

The `db.json` file will automatically be created and updated as you use the application:

```json
{
  "users": [
    {
      "id": "user_1234567890_abc123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "dateOfBirth": "1990-01-01",
      "password": "hashedpassword",
      "companyName": "Example Corp",
      "jobTitle": "Manager",
      "businessType": "Retail",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA",
      "agreeToTerms": true,
      "newsletter": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "isActive": true
    }
  ]
}
```

## Other Database Options

For other database setups (MongoDB, MySQL, PostgreSQL, Firebase), see the main `database-setup-guide.md` file in the project root.

## Development Tips

1. **Auto-reload**: JSON Server automatically reloads when `db.json` changes
2. **CORS**: JSON Server includes CORS headers by default
3. **Validation**: Add custom validation by creating a `routes.json` file
4. **Middleware**: Add custom middleware by creating a `server.js` file

## Troubleshooting

- **Port already in use**: Change port in package.json scripts
- **CORS issues**: JSON Server handles CORS automatically
- **Data not saving**: Check if server is running and accessible 