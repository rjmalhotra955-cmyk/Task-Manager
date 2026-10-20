# Task Manager

A full-stack task management app built with Node.js, Express, and MongoDB. You can create, view, edit, and delete tasks from a simple web interface.

## Features

- Add new tasks
- Mark tasks as completed
- Edit and delete tasks
- REST API with proper error handling
- Simple frontend served from the same server

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Frontend:** HTML, CSS, JavaScript
- **Tools:** dotenv, nodemon

## Getting Started

### Prerequisites

- Node.js installed
- A MongoDB database (local or MongoDB Atlas)

### Installation

1. Clone the repository
```bash
   git clone https://github.com/rjmalhotra955-cmyk/Task-Manager.git
   cd Task-Manager
```

2. Install dependencies
```bash
   npm install
```

3. Create a `.env` file in the root folder and add your MongoDB connection string
```
   MONGO_URI=your_mongodb_connection_string
```

4. Start the server
```bash
   npm start
```

5. Open `http://localhost:3000` in your browser

## API Endpoints

| Method | Endpoint             | Description        |
|--------|----------------------|--------------------|
| GET    | /api/v1/tasks        | Get all tasks      |
| POST   | /api/v1/tasks        | Create a new task  |
| GET    | /api/v1/tasks/:id    | Get a single task  |
| PATCH  | /api/v1/tasks/:id    | Update a task      |
| DELETE | /api/v1/tasks/:id    | Delete a task      |

## Project Structure

```
controllers/   Request handling logic
db/            Database connection
errors/        Custom error classes
middleware/    Error handler, not-found, async wrapper
models/
