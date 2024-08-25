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
    npm run db:start // to init tables
    npm run db:seed //to seed db
    npm run start:prod //for production 
    npm run start:dev //for development
    ```

## Project Structure
- routes/: Contains all the route definitions for the project.
- services/: Contains the business logic and interactions with the database.
- utils/: Contains utility functions and helpers shared across different parts of the application.

