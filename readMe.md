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
## Seeders

The seeders will populate the database with three initial users:

    Admin User
        Name: Admin
        Email: admin@gmail.com
        Password: (hashed)
        Number of Logins: 10
        Last Login: 5 hours ago
        Role: admin
        Verified: true

    Bob
        Name: Bob
        Email: bob@example.com
        Password: (hashed)
        Number of Logins: 5
        Last Login: 2 months ago
        Role: user
        Verified: true

    Charlie
        Name: Charlie
        Email: charlie@example.com
        Password: (hashed)
        Number of Logins: 30
        Last Login: 5 hours ago
        Role: user
        Verified: true

Note: The password field values are hashed and will not be readable in plaintext **(password: 123123123)** .
## Project Structure
- routes/: Contains all the route definitions for the project.
- services/: Contains the business logic and interactions with the database.
- utils/: Contains utility functions and helpers shared across different parts of the application.

