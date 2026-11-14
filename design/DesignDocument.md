# SubletBoard Design Document

Team: Jiaying Guo and Yanli Wang

Class: [CS5610 Web Development, Fall 2026](https://johnguerra.co/classes/webDevelopment_online_fall_2026/), Northeastern University

## Project Description

SubletBoard helps Northeastern students find sublets and roommates.

Many Northeastern students leave Boston for a co-op or a semester and need someone to take their room, while new students need a short-term place to stay or someone to split rent with. Right now this happens in messy Facebook groups and group chats, where posts get buried in a few days and it is hard to search by price, dates or neighborhood.

SubletBoard gives students one place to post and find sublets, and to find a roommate who fits their budget and lifestyle. Students can search sublets by neighborhood, price, dates and furnished, and search roommate profiles by budget, neighborhood, move-in date, sleep schedule, pets and smoking. Students log in to post and to see contact emails, and only the author can edit or delete their own listings and profiles.

The app has two independent features: sublet listings and roommate profiles. They are stored in separate collections and never read each other. Each listing or profile saves the poster's name and contact email when it is created. The database has more than 1,000 synthetic sublet listings and more than 1,000 synthetic roommate profiles.

## User Personas

**Emily** is a grad student going on a co-op in another city from January to June. She wants to find someone to take her room so she does not pay rent for an empty room.

**Daniel** is a new grad student arriving in January. He needs a furnished room near campus for one semester and has a tight budget.

**Priya** is a student who wants to move into a bigger apartment and split the rent. She stays up late and has a cat, so she needs a roommate who is fine with that.

**Marcus** is a student who gets up early and wants a quiet roommate. He already found a roommate once and wants to hide his profile until next year.

## User Stories

### Jiaying Guo: sublet listings

1. As Emily, I want to sign up and log in so that only I can edit or delete my listings.
2. As Emily, I want to create, edit, and delete sublet listings with the neighborhood, rent, start and end dates, furnished or not, commute time to campus, a photo link, and a description so that I can find someone to take my room.
3. As Daniel, I want to search and filter sublets by neighborhood, price range, dates, and furnished, and open a listing to see its details and the poster's contact email, so that I can find a room that fits my budget and my semester.
4. As Emily, I want to see all my listings on one page and mark a listing as rented so that people stop contacting me about it.

### Yanli Wang: roommate profiles

5. As Priya, I want to create, edit, and delete my roommate profile with my budget, preferred neighborhoods, move-in date, sleep schedule, pets, smoking, and a short bio so that other students can get to know me.
6. As Priya, I want to search and filter roommate profiles by budget, neighborhood, move-in date, sleep schedule, pets, and smoking, and open a profile to see the contact email, so that I can find someone who fits my lifestyle.
7. As Marcus, I want to see my own profile on a My Profile page, and hide it from search after I find a roommate and show it again later, so that I only get messages when I am looking.

## Changes From the Proposal

- Each sublet listing has a short title, so listings are easy to tell apart in the search results.
- Sublet search results can be sorted by newest or by price, and are split into pages of 12.
- When a listing is marked as rented, it is hidden from search and its detail page no longer shows the contact email, so people stop contacting the poster.
- Besides the libraries approved in the proposal (dotenv, @faker-js/faker and connect-mongo), the app uses passport-local and express-session, which are the standard way to use Passport with a username and password, and react-router-dom and prop-types, which the project requirements ask for.

## Data

We use MongoDB with four collections. `sublets` and `roommates` are the two collections with full create, read, update and delete. `users` and `sessions` only support login.

| Collection  | Owner                    | Where the data comes from                   | Main fields                                                                                                                                                   |
| ----------- | ------------------------ | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sublets`   | Jiaying Guo              | 1,200 synthetic listings (Faker), and users | title, neighborhood, rent, startDate, endDate, furnished, commuteMinutes, photoUrl, description, status, authorId, authorName, authorEmail, seeded, createdAt |
| `roommates` | Yanli Wang               | Synthetic profiles (Faker), and users       | Added by Yanli Wang                                                                                                                                           |
| `users`     | Jiaying Guo              | Synthetic users (Faker), and sign ups       | name, email, passwordHash, salt, seeded, createdAt                                                                                                            |
| `sessions`  | Created by connect-mongo | Login sessions                              | session data and expiry date                                                                                                                                  |

The synthetic data is generated with a fixed Faker seed, so running the seed scripts again gives the same records. The seed scripts only replace records marked `seeded: true`, so accounts and listings created by real users are kept.

## Tech Stack

- Frontend: React with hooks, React Router, Fetch API, built with Vite
- Backend: Node.js and Express with ES modules
- Authentication: Passport with a local strategy (email and password), sessions saved in MongoDB with connect-mongo
- Database: MongoDB with the native Node.js driver
- Deployment: Render, with MongoDB Atlas
