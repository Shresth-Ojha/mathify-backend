# Mathify - A quizzing app for students!

## Welcome
Welcome to the Mathify Backend repo! This app is designed to provide an interactive and engaging platform for students to practice and test their knowledge in maths (later more field). Whether you're a student preparing for exams or a teacher looking for a fun way to assess your students, this app has got you covered.

POSTMAN API for testing: [Mathify-API-Shresth](https://documenter.getpostman.com/view/23647766/2s9YyvBL9T)

## Features
* User Registration and Login
  - Most important in today's time -> password encryption!
  - No users with duplicate emails.
  - Password matching.
  - Email registration check.
  - Authentication initiated using jwt token cookie upon login.
* User fetch, update and logout.
  - Additional layer of security to check if the authenticated user is fetched.
  - Updation of others' details not allowed.
  - Cookie clearance upon logging out.
* Quiz CRUD
  - Anyone can create a quiz (everyone has something that others' want to or should learn!)
  - Fetching the quiz
  - Fetching all quizzes created by a user.
  - Updation/deletion of unpublished quizzes.
  - Updation/deletion of others' quizzes not allowed.
  - Publishing the quiz by the author (unpublished quizzes can't be attempted).
  - Once published, quiz can't be updated or deleted as people might have started attempting it.
* Attempting a quiz -> EXAM!
  - Fetching the exam details with questions and answers.
  - Submitting an attempt and storing a report with the score, total and submissions of each question.
* Reports
  - Getting a single report or all of the reports of the user.
  - Fetching of others' reporst not allowed!
 
### Note : While all of these features are implemented, there may be bugs / roundabouts where improvement is needed.

## Getting Started
First and foremost, fork this repo. Then follow these steps to get started with the backend server:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/mathify-backend.git
   ```

2. **Navigate to the Project Directory:**
   ```bash
   cd mathify-backend
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Run the App in development environment:**
   ```bash
   npm run start:dev
   ```
   The app will be accessible at `http://localhost:3000` by default.

## Contact
If you have any questions, feedback, or suggestions, please don't hesitate to reach out to me at [Shresth-Ojha](mailto:shresthojha.iitdelhi@gmail.com) or phone: +91 98109 45697.

#### Happy quizzing!
