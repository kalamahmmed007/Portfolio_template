# Portfolio Backend API

A complete RESTful API built with Node.js, Express, and MongoDB for a portfolio website with admin dashboard.

## Features

- 🔐 JWT Authentication
- 👤 User Management
- 📁 Project Management (CRUD)
- 🎯 Skills Management (CRUD)
- 💼 Experience Management (CRUD)
- 📧 Contact Form Messages
- 🔒 Protected Admin Routes
- ✅ Input Validation
- 🚀 Error Handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer (optional)
- **Image Storage**: Cloudinary (optional)
- **Email**: Nodemailer (optional)

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd server
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`

5. Start MongoDB (if running locally)
```bash
mongod
```

6. Seed the database (optional)
```bash
npm run seed
```

This will create:
- Admin user (email: admin@portfolio.com, password: admin123)
- Sample projects
- Sample skills
- Sample experiences

7. Start the server
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## Environment Variables

```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173

# Optional: Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Optional: Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=
SMTP_PASSWORD=
FROM_EMAIL=
FROM_NAME=
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/update-password` - Update password (Protected)

### Projects
- `GET /api/projects` - Get all projects (Public)
- `GET /api/projects/:id` - Get single project (Public)
- `POST /api/projects` - Create project (Admin)
- `PUT /api/projects/:id` - Update project (Admin)
- `DELETE /api/projects/:id` - Delete project (Admin)

Query Parameters:
- `category`: Filter by category (web, mobile, desktop, other)
- `featured`: Filter featured projects (true/false)
- `limit`: Limit number of results

### Skills
- `GET /api/skills` - Get all skills (Public)
- `GET /api/skills/:id` - Get single skill (Public)
- `POST /api/skills` - Create skill (Admin)
- `PUT /api/skills/:id` - Update skill (Admin)
- `DELETE /api/skills/:id` - Delete skill (Admin)

Query Parameters:
- `category`: Filter by category (frontend, backend, database, tools, other)

### Experience
- `GET /api/experience` - Get all experiences (Public)
- `GET /api/experience/:id` - Get single experience (Public)
- `POST /api/experience` - Create experience (Admin)
- `PUT /api/experience/:id` - Update experience (Admin)
- `DELETE /api/experience/:id` - Delete experience (Admin)

### Messages
- `GET /api/messages` - Get all messages (Admin)
- `GET /api/messages/:id` - Get single message (Admin)
- `POST /api/messages` - Create message (Public)
- `PUT /api/messages/:id` - Update message (Admin)
- `DELETE /api/messages/:id` - Delete message (Admin)

Query Parameters:
- `read`: Filter by read status (true/false)

## Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Login Example
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@portfolio.com",
    "password": "admin123"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@portfolio.com",
    "role": "admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Project Structure

```
server/
├── config/
│   ├── db.js                 # MongoDB connection
│   ├── cloudinary.js         # Cloudinary setup
│   └── nodemailer.js         # Email configuration
├── models/
│   ├── User.js               # User schema
│   ├── Project.js            # Project schema
│   ├── Skill.js              # Skill schema
│   ├── Message.js            # Message schema
│   └── Experience.js         # Experience schema
├── routes/
│   ├── auth.js               # Auth routes
│   ├── projects.js           # Project routes
│   ├── skills.js             # Skill routes
│   ├── messages.js           # Message routes
│   └── experience.js         # Experience routes
├── controllers/
│   ├── authController.js     # Auth logic
│   ├── projectController.js  # Project logic
│   ├── skillController.js    # Skill logic
│   ├── messageController.js  # Message logic
│   └── experienceController.js # Experience logic
├── middleware/
│   ├── auth.js               # JWT authentication
│   ├── upload.js             # File upload
│   └── errorHandler.js       # Error handling
├── utils/
│   ├── jwt.js                # JWT utilities
│   └── email.js              # Email utilities
├── server.js                 # App entry point
├── seeder.js                 # Database seeder
├── package.json
└── .env.example
```

## Error Handling

All errors are handled centrally and return a consistent format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

## Database Seeding

To seed the database with sample data:

```bash
# Import data
npm run seed

# Delete data
npm run seed -d
```

## Deployment

### MongoDB Atlas Setup
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### Deployment Platforms
- **Heroku**: Easy deployment with Git
- **Railway**: Modern platform with automatic deployments
- **Render**: Free tier available
- **DigitalOcean**: App Platform or Droplets
- **AWS**: EC2, Elastic Beanstalk, or Lambda

### Example: Deploy to Render
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set environment variables
5. Deploy!

## Testing

Test the API health:
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## Security Best Practices

- ✅ Passwords are hashed with bcrypt
- ✅ JWT tokens for authentication
- ✅ Input validation on all routes
- ✅ CORS enabled
- ✅ MongoDB injection prevention
- ✅ Rate limiting (recommended to add)
- ✅ Helmet.js (recommended to add)

## License

MIT

## Support

For issues or questions, please create an issue in the repository.