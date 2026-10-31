# SYNTXT

## Where Ideas Connect.

SYNTXT is a full-stack blogging and publishing community built with React, Express, MongoDB, and JWT cookie authentication.

## Project structure

- `client/` — Vite React application
- `server/` — Express API, Mongoose models, authentication, and authorization

## Local setup

1. Copy `server/.env.example` to `server/.env` and provide MongoDB and JWT values.
2. Install dependencies with `npm run install:all`.
3. Run both applications with `npm run dev`.
4. The client runs on `http://localhost:5173`; the API runs on `http://localhost:5000`.

## Core features

Registration and login, draft/published articles, ownership-protected editing, comments, search, categories, tags, profiles, and persistent light/dark themes.

## Testing

Run backend tests with `npm test`. Tests use the configured test database and do not require production credentials.

