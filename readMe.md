# Project Setup and Documentation

## Setup Instructions

To get started with the project, follow these steps:

1. **Install Dependencies**
    
   First, install all the required npm packages:
   ```bash
    npm install  
    ```
2. **Add your .env file like .sample.env**

3. **Commands**
    ```bash
    npm run start:db // to init tables
    npm run start:seed //to seed db
    npm run start:prod //for production 
    npm run start:dev //for development
    ```

## Project Structure
- routes/: Contains all the route definitions for the project.
- services/: Contains the business logic and interactions with the database.
- utils/: Contains utility functions and helpers shared across different parts of the application.

Docker Setup
If you want to use Docker to run the application, follow these steps:

Start Docker Containers

Use the following command to start the Docker containers:

```bash
docker-compose up
```