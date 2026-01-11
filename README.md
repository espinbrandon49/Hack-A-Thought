# Hack-A-Thought
**Live Demo:** https://hack-a-thought-473618422e58.herokuapp.com/


A clean, full-stack blogging platform focused on the core authoring loop: **write → read → discuss**.  
Built as a revamp exercise to demonstrate modern React + Express architecture, consistency, and reliability.

---

## What It Is

Hack-A-Thought is a minimal multi-user blog application with authentication, ownership enforcement, and real-time-feeling UX.  
The project intentionally avoids feature bloat to highlight clean data flow, predictable APIs, and production-style patterns.

---

## Tech Stack

### Server
- Node.js
- Express
- Sequelize (SQL)
- Cookie-based sessions
- Centralized controllers, middleware, and error handling

### Client
- React (Vite)
- React Router
- Axios (single consolidated API client)
- Tailwind CSS
- Controlled loading / empty / error states throughout

---

## Core Features (Core Loop Only)

- User signup, login, logout (session-based)
- Public blog feed
- Blog detail view with comments
- Authenticated dashboard for:
  - Creating posts
  - Editing own posts
  - Deleting own posts
- Commenting on posts
- Ownership enforcement (users can only modify their own content)
- Consistent API response contract across the entire app

---

## Local Setup

```bash
# clone repo
git clone https://github.com/espinbrandon49/Hack-A-Thought.git
cd hack-a-thought
```

### Server

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### Client

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

The client expects the API base URL via `VITE_API_BASE_URL`.

---

## Deployment

This app is deployed as a Heroku monolith:

- React (Vite) is built during deploy and served from the Express server
- API is namespaced under `/api`
- Database: JawsDB (MySQL)
- Auth: cookie-based sessions

**Live Demo:** https://hack-a-thought-473618422e58.herokuapp.com/

---

## Demo

**Video Walkthrough (≈75 seconds):**  
https://youtube.com/watch?v=9LdCU8SGrsc&feature=youtu.be

This short demo shows the full core loop of the application:

- Authentication with session persistence (login survives refresh)
- Viewing the feed and opening a blog post
- Creating a comment and confirming it persists
- Managing posts in the dashboard (create, edit, delete)
- Ownership enforcement (users can only modify their own content)

The goal of the demo is clarity: a viewer should understand what the app does and how it works in under two minutes.

---

## Demo Flow (60–90 seconds)

- Open the app → public feed loads
- Sign up a new user
- Create a blog post from Dashboard
- Return to Feed → post appears
- Open blog detail → view content
- Add a comment
- Refresh → comment persists
- Edit the post
- Attempt unauthorized edit (blocked)
- Logout → session cleared

---

## Future Features (Intentionally Small)

- Pagination on feed
- Post tags or categories
- Basic search
- Markdown rendering for posts

> This project is intentionally scope-locked.  
> Future features are noted for clarity, not roadmap commitment.
