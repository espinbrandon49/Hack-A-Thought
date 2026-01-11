# Hack-A-Thought

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
