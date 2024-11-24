# TechTalk

**TechTalk** is a full-stack web application for exploring categorized discussions, asking questions, and providing answers. This platform enables users to engage with meaningful content and participate in community-driven knowledge sharing.

---

## Features

### User Features

- **Authentication**: Secure user registration and login using JWTs.
- **Categorized Questions**: Predefined categories make it easy to browse and organize discussions.
- **Interactive Discussions**: Users can ask questions, answer existing ones, and view detailed threads.
- **Persistent State**: Maintains category selections in the URL for seamless navigation.

### Technical Features

- **Decoupled Backend**: Modular repositories abstract database interactions.
- **Input Validation**: Ensures valid input, such as questions ending with a question mark.
- **Scalability**: Built for containerized deployment using Docker.

---

## Tech Stack

- **Frontend**: React (with Vite bundler)
- **Backend**: Node.js and Express
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT) and bcrypt
- **Containerization**: Docker

---

## Local Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Docker](https://www.docker.com/) (optional for containerized deployment)

### Steps to Run Locally

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/oddvelvetgoldfish/project-5.git
   cd project-5
   ```

2. **Set Up the Backend**:

   - Navigate to the `backend` directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Run the backend server:
     ```bash
     npm run start
     ```
     The backend will start on port `3000` by default.

3. **Set Up the Frontend**:

   - Navigate to the `frontend` directory:
     ```bash
     cd ../frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```
   - The frontend will be available at `http://localhost:5173`.

4. **Access the Application**:
   - Open the frontend URL in your browser to interact with the app. Ensure both the backend and frontend servers are running.

---

## Docker Deployment

To deploy the app in a containerized environment, follow these steps:

1. **Build the Docker Image**:

   ```bash
   docker build -t techtalk .
   ```

2. **Run the Container**:
   ```bash
   docker run -p 5001:3000 techtalk
   ```
   - The backend will be accessible at `http://localhost:5001`.
