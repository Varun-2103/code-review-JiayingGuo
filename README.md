# SubletBoard

Sublets and roommates for Northeastern students.

## Authors

- Jiaying Guo
- Yanli Wang

## Class

[CS5610 Web Development, Fall 2026](https://johnguerra.co/classes/webDevelopment_online_fall_2026/), Northeastern University

## Project Objective

Many Northeastern students leave Boston for a co-op or a semester and need someone to take their room, while new students need a short-term place to stay or someone to split rent with. Right now this happens in messy Facebook groups and group chats. SubletBoard gives students one place to post and find sublets, and to find a roommate who fits their budget and lifestyle.

## Features

### Sublet listings (Jiaying Guo)

- Sign up and log in. Only the author can edit or delete their own listings.
- Post a sublet with a title, neighborhood, rent, start and end dates, furnished or not, commute time to campus, a photo link and a description. Edit or delete it later.
- Search sublets by neighborhood, price range, dates and furnished, and sort by newest or price.
- Open a listing to see its details. Logged-in students can see the poster's contact email.
- See all your listings on the My Listings page, and mark a listing as rented so it is hidden from search.

### Roommate profiles (Yanli Wang)

- Create, edit and delete a roommate profile, and hide or show it in search.
- Search profiles by budget, neighborhood, move-in date, sleep schedule, pets and smoking.

## Tech Stack

- Frontend: React (hooks), React Router, Fetch API, Vite
- Backend: Node.js, Express
- Authentication: Passport (local strategy) with sessions saved in MongoDB (connect-mongo)
- Database: MongoDB (native Node.js driver)

## Instructions to Build

You need Node.js 20 or newer and a MongoDB database (for example a free MongoDB Atlas cluster).

1. Clone the repository.

   ```bash
   git clone https://github.com/yanliw123/SubletBoard.git
   cd SubletBoard
   ```

2. Set up the backend. Copy `backend/.env.example` to `backend/.env` and fill in `MONGO_URI` and `SESSION_SECRET`.

   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```

3. Set up the frontend.

   ```bash
   cd ../frontend
   npm install
   ```

4. Run both in development, each in its own terminal. Open the address that Vite prints (usually http://localhost:5173). Vite sends `/api` requests to the Express server on port 3000.

   ```bash
   cd backend && npm run dev
   cd frontend && npm run dev
   ```

5. To run it like production, build the frontend and start the backend. Express serves the built app at http://localhost:3000.

   ```bash
   cd frontend && npm run build
   cd ../backend && npm start
   ```

### Lint and format

Run these in `backend` and in `frontend`:

```bash
npm run lint
npm run format:check
```

## Project Structure

```
backend/            Express API
  server.js         App entry point
  db/               MongoDB connection, indexes and queries
  middleware/       Error handler
  constants/        Shared lists (neighborhoods, demo account)
  utils/            Helpers (date validation)
frontend/           React app built with Vite
  src/App.jsx       App entry component
  src/constants/    Shared lists (neighborhoods)
design/             Design document and mockups
```

Each React component lives in its own folder together with its CSS file of the same name.

## AI Disclosure

We used Claude to help plan the project, review the code and write parts of the documentation.

## License

[MIT](LICENSE)
