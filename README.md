# RALLE Backend API

This Node.js + Express server powers the RALLE app. It connects to a PostgreSQL database and exposes RESTful endpoints for users, events, onboarding, merch, and membership.

## Base URL
http://localhost:3001/api


## Endpoints

### Users
- `GET /users` – List all users
- `POST /users/register` – Register new user
- `POST /users/login` – Login user

### Events
- `GET /events` – List all events
- `POST /events/register` – Register user for event

###  Onboarding
- `POST /onboarding` – Save onboarding answers
- `GET /onboarding/:userId` – Get answers by user

### Merch
- `GET /merch` – List all merch items
- `POST /merch/order` – Create new merch order

### Membership
- `GET /membership` – List all memberships
- `POST /membership/assign` – Assign membership to user
- `GET /membership/user/:userId` – Get user membership

## Environment Variables

DATABASE_URL=postgres://yourUser:yourPassword@localhost:5432/ralle_prod
PORT=3001
