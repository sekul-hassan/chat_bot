# Doc AI Backend

## Requirements

Before running this project, ensure you have the following installed and configured:

1. **XAMPP** (for Apache & MySQL)
2. **Node.js**
3. **Git** (to clone this project)
4. **Postman** (optional, for testing APIs)

> If these are not installed, please install and configure them first. You can find setup guides online.

---

## Database Setup

1. Open the **XAMPP Control Panel**.
2. Start **Apache** and **MySQL**.
3. Open [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
4. Create a new database named:

   ```sql
   doc_ai_app
   ```

---

## Project Setup

1. Open a terminal and navigate to any directory on your computer.

2. Clone the repository:

   ```bash
   git clone https://github.com/sekul-hassan/doc_ai_backend
   ```

3. Go into the project folder:

   ```bash
   cd doc_ai_backend
   ```

4. Create a `.env` file in the project root and add the following credentials:

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=doc_ai_app
   DB_DIALECT=mysql
   DB_PORT=3306

   GEMINI_API_KEY=YOUR_API_KEY

   JWT_SECRET=YOUR_JWT_TOKEN
   PORT=5000
   ```

5. Install dependencies:

   ```bash
   npm install
   ```

6. Start the backend server:

   ```bash
   npm run dev
   ```

The backend will now be running on **port 5000**.

---

## Frontend Setup

To start the frontend, visit the following repository:
👉 [Doc AI Frontend](https://github.com/sekul-hassan/doc_ai_frontend)

---

✨ **Thank you for using Doc AI Backend!**

