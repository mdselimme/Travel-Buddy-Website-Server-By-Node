# Travel Buddy Server Site By Node, Express, Ts

Travel Buddy is a website where people can find their desire travel buddy. Like If you are bored and you want to go a tour. So you can post here your tour details. Then who is like you want to go a tour he will see you travel plan details if he is interested in this travel plan then he send you a request to go with you. Also this platform is subscription based. Here have two types subscription Monthly and yearly. If you want to use this website you have to need subscribed first.

## Features of this website:

    * User register/login
    * User can create travel plan with details and managed it.
    * Also user can connect with other travel plan.
    * User have to need subscription to use this website.
    * Admin can manages all the users, travel plan, subscription etc.

## Tech Stack:

    - **Runtime:** Node
    - **Language:** Typescript
    - **Framework:** Express
    - **Database & ODM:** MongoDB & Mongoose
    - **Authorization & Authentication:** Json Web Token (Jwt)
    - **Data Validation & Security:** Zod, Bcrypt and many more.
    - **Payment Gateway:** SSL Commerz

# Set Up and Installation

**Clone the repository**

```bash

git clone git@github.com:mdselimme/Travel-Buddy-Website-Server-By-Node.git

```

**Set up .env file with requirement variables**

```env

# initialize server environment variables

PORT=
NODE_ENV=
DB_URL=

#CLIENT URL
CLIENT_SITE_URL=

#BCRYPT
BCRYPT_SALT_ROUNDS=

#SUPER ADMIN CREDENTIALS
SUPER_ADMIN_EMAIL=
SUPER_ADMIN_PASSWORD=
SUPER_ADMIN_NAME=

#JWT
JWT_ACCESS_TOKEN_SECRET=
JWT_ACCESS_TOKEN_EXPIRED=
JWT_REFRESH_TOKEN_SECRET=
JWT_REFRESH_TOKEN_EXPIRED=
JWT_FORGOT_TOKEN_EXPIRED=

#CLOUDINARY CONFIG
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_SECRET=

#SSL COMMERZ CONFIG
SSL_COMMERZ_STORE_ID=
SSL_COMMERZ_STORE_PASS=
SSL_COMMERZ_PAYMENT_API=
SSL_COMMERZ_VALIDATION_API=
SSL_COMMERZ_IPN_URL=

#SSL COMMERZ FRONTEND URL
SSL_SUCCESS_FRONTEND_URL=
SSL_FAIL_FRONTEND_URL=
SSL_CANCEL_FRONTEND_URL=

# SSL Commerz BACKEND URLs

SSL_SUCCESS_BACKEND_URL=
SSL_FAIL_BACKEND_URL=
SSL_CANCEL_BACKEND_URL=

#Email Sending Config
SMTP_PASS=
SMTP_USER=
SMTP_HOST=
SMTP_PORT=
SMTP_FROM=

# REDIS CONFIG

REDIS_HOST=
REDIS_PORT=
REDIS_USERNAME=
REDIS_PASSWORD=


```

## Getting Started

First, run the development server:

```bash
npm run dev
```
