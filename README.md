
# ShareAPlate - Backend API

![ShareAPlate Logo](https://share-a-plate-a1shuvo.web.app/logo.png)  

**ShareAPlate** is a food waste reduction platform connecting restaurants, charities, and users to share surplus food. This repository contains the **backend server** built with **Node.js, Express.js, and MongoDB**, featuring authentication via Firebase, role-based access, and payment integration.

---

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Middleware](#middleware)
- [Database Models](#database-models)
- [License](#license)

---

## Features

- Restaurant donation management (CRUD)
- Donation requests from charities
- Favorite donations for users
- Review system for donations
- Payment integration with Stripe
- Role-based access control: `admin`, `restaurant`, `charity`, `user`
- Analytics: donation statistics
- Fully authenticated routes via Firebase

---

## Technologies

- Node.js
- Express.js
- MongoDB (via `mongodb` driver)
- Firebase Authentication
- Stripe API for payments
- CORS enabled for allowed domains
- JSON Web Token (JWT) integration via Firebase

---

## Getting Started

### Clone the repository

```bash
git clone https://github.com/a1shuvo/share-a-plate-server.git
cd share-a-plate-server
```

### Install dependencies

```bash
npm install
```

### Run the server

```bash
npm run dev
```

The server will start on `http://localhost:3000`.

---

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
STRIPE_SECRET_KEY=your_stripe_secret_key
```

---

## API Endpoints

### Users

- `PUT /api/v1/users/upsert` - Create or update user
- `GET /api/v1/users/` - Admin: Get all users
- `GET /api/v1/users/:email` - Get user by email
- `PATCH /api/v1/users/:email` - Admin: Update user
- `DELETE /api/v1/users/:id` - Admin: Delete user

### Donations

- `GET /api/v1/donations/featured` - Get featured donations
- `GET /api/v1/donations/statistics` - Restaurant: Donation statistics
- `GET /api/v1/donations/active` - Get all active donations
- `GET /api/v1/donations/mine/all` - Restaurant: My donations
- `POST /api/v1/donations/` - Restaurant: Create donation
- `PATCH /api/v1/donations/:id` - Restaurant: Update donation
- `PATCH /api/v1/donations/admin/status/:id` - Admin: Update donation status
- `DELETE /api/v1/donations/:id` - Restaurant: Delete donation

### Requests (Charity Donations)

- `GET /api/v1/requests/latest` - Latest donation requests (public)
- `POST /api/v1/requests/` - Charity: Request donation
- `GET /api/v1/requests/mine` - Charity: My requests
- `GET /api/v1/requests/restaurant` - Restaurant: View requests
- `PATCH /api/v1/requests/accept/:id` - Restaurant: Accept request
- `PATCH /api/v1/requests/reject/:id` - Restaurant: Reject request
- `PATCH /api/v1/requests/confirm/:donationId` - Charity: Confirm pickup

### Reviews

- `POST /api/v1/reviews/` - Add review
- `GET /api/v1/reviews/donation/:donationId` - Get reviews by donation
- `GET /api/v1/reviews/mine/all` - Get my reviews
- `DELETE /api/v1/reviews/:id` - Delete review

### Favorites

- `POST /api/v1/favorites/` - Add favorite
- `GET /api/v1/favorites/mine` - My favorites
- `DELETE /api/v1/favorites/:donationId` - Remove favorite

### Payments

- `POST /api/v1/payments/create-payment-intent` - Create Stripe payment intent

### Role Requests

- `POST /api/v1/role-requests/` - Create role request
- `GET /api/v1/role-requests/` - Admin: View all requests
- `PATCH /api/v1/role-requests/:id` - Admin: Update role request status

### Transactions

- `POST /api/v1/transactions/` - Save transaction
- `GET /api/v1/transactions/` - Get transactions by email
- `GET /api/v1/transactions/all` - Admin: Get all transactions

---

## Middleware

- `verifyFBToken` - Validates Firebase JWT
- `verifyRole(role)` - Ensures user has required role
- CORS configured for allowed domains

---

## Database Models

- Users
- Donations
- Requests
- Reviews
- Favorites
- Transactions
- RoleRequests

---

## License

MIT License.  
Made with ❤️ for **ShareAPlate** by Shuvo Saha
