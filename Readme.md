# Travel Buddy Server Site By Node, Express, Ts

Travel Buddy is a website where people can find their desire travel buddy. Like If you are bored and you want to go a tour. So you can post here your tour details. Then who is like you want to go a tour he will see you travel plan details if he is interested in this travel plan then he send you a request to go with you. Also this platform is subscription based. Here have two types subscription Monthly and yearly. If you want to use this website you have to need subscribed first.

Database Relation ERD : [https://drive.google.com/file/d/19kGheUiKry_k2JYtKVL43ewHXwGiB4IW/view?usp=sharing]

## Features of this website:

    * User register/login
    * User can create travel plan with details and managed it.
    * Also user can connect with other travel plan.
    * User have to need subscription to use this website.
    * Admin can manages all the users, travel plan, subscription etc.
    * Payment by sslCommerz.
    * Email send
    * Otp feature

## Tech Stack:

    - **Runtime:** Node
    - **Language:** Typescript
    - **Framework:** Express
    - **Database & ODM:** MongoDB & Mongoose, Redis For Otp.
    - **Authorization & Authentication:** Json Web Token (Jwt)
    - **Data Validation & Security:** Zod, Bcrypt, Rate Limiter.
    - **Payment Gateway:** SSLCommerz
    - **Other:** Nodemailer

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


#RATE LIMITER
RATE_LIMITER_WINDOW_MS=
RATE_LIMITER_AUTH_MAX_REQUEST=
RATE_LIMITER_API_MAX_REQUEST=

```

## Getting Started

First, run the development server:

```bash
npm run dev
```

--

# Api Documentation & Configuration.

## User Api Description:

- User can create an account with name, email, password, role (User|Agent) type.

#### 1. user create api

- method: `POST` api endpoint: http://localhost:5000/api/v1/user/register

##### schema design:

```json
{
    "fullName": string,
    "email": string,
    "password":string,
}
```

##### Request:

```json
{
    "name": "Md Selim",
    "email": "selimakondo58@gmail.com",
    //Password should be min 8 char length & 1 uppercase & lowercase & special character
    "password":"Ss@12345",
}
```

#### Response:

```json
{
    "message": "User Created Successfully.",
    "statusCode": 201,
    "success": true,
    "data": {
        "_id": "688cab104f2d722330f5117d",
        "name": "Md. Selim",
        "email": "selimakondo60@gmail.com",
        "role": "USER",
        "isActive": "Active",
        "isVerified": "true",
    }
}
```

#### 2. user update api

- method: `PATCH` api endpoint: http://localhost:5000/api/v1/user

##### Description

**credentials**: true,
**data type**: form data -> data name
**profile image**: image data -> file name

##### schema design:

```json
{
    //userId must be object id
    "userId": string,
    "fullName": string,
    //must be valid 11 digit bd number
    "contactNumber": string,
    "address":string,
    "visitedPlaces":[string],
    "currentLocation":string,
    //interest value will be travel types object id
    "interests":[string],
    "bio":string,
}
```

##### Request:

```json
{
    "userId": "693655b55c1fdea7cf2cc2c2",
    "fullName": "MD SELIM",
    "contactNumber": "01700000000",
    "address":"DHAKA",
    "visitedPlaces":["DHAKA", "KOLKATA"],
    "currentLocation":"DHAKA",
    "interests":["693656c596030ba0219fe0a0","693656bb96030ba0219fe09c"],
    "bio":"I am tracking lover and a programmer",
}
```

#### Response:

```json
{
    "statusCode": 200,
    "data": {
        "_id": "693655b55c1fdea7cf2cc2c4",
        "user": "693655b55c1fdea7cf2cc2c2",
        "fullName": "Super Admin",
        "email": "contact.mdselim.dev@gmail.com",
        "visitedPlaces": [
            "Dhaka",
            "Nilphamary",
            "Mymensingh"
        ],
        ....
    },
    "message": "User updated successfully",
    "success": true
}
```

#### 3. User Update Role

- method: `PATCH` api endpoint: http://localhost:5000/api/v1/user/update-role

##### Description

**credentials**: true,
**Role**: SUPER_ADMIN only

##### schema design:

```json
{
    //userId must be object id
    "userId": string,
    //role must be ADMIN OR USER
    "role": "ADMIN"
}
```

#### Request:

```json
{
    "userId":"69366628e105d53a242bd1ad",
    "role": "ADMIN"
}
```

#### Response:

```json
{
    "statusCode": 200,
    "data": {
       "role": "ADMIN"
    },
    "message": "Update User Role successfully",
    "success": true
}
```

#### 4. User Update Status

- method: `PATCH` api endpoint: http://localhost:5000/api/v1/user/update-status/{objectid}

##### Description

**credentials**: true,

##### schema design:

```json
{
    //ACTIVE, INACTIVE, BLOCKED, DELETED
   "isActive":string;
}
```

##### Request:

```json
{
   "isActive":"ACTIVE"
}
```

#### Response:

```json
{
    "statusCode": 200,
    "data": {
    "isActive":"ACTIVE"
    },
    "message": "Update User Role successfully",
    "success": true
}
```

#### 5. Get All User

- method: `GET` api endpoint: http://localhost:5000/api/v1/user?limit=2&page=1&role=ADMIN&email=contact.mdselim.dev@gmail.com&isVerified=true&search=contact&startDate=2025-12-01&endDate=2025-12-04

## Description

**credentials**: true,

**Query**:

limit, page, role, email, isVerified, search, startDate, endDate;

#### Response:

```json
{
    "statusCode": 200,
    "data": [
        {
        "_id": "693655b55c1fdea7cf2cc2c4",
        "user": "693655b55c1fdea7cf2cc2c2",
        "fullName": "Super Admin",
        "email": "contact.mdselim.dev@gmail.com",
        "visitedPlaces": [
            "Dhaka",
            "Nilphamary",
            "Mymensingh"
        ],
        ....
    }
    ....
    ],
    "message": "Users retrieved successfully",
    "success": true
}
```

#### 6. Get Single User by id

- method: `GET` api endpoint: http://localhost:5000/api/v1/user/{objectid}

## Description

**credentials**: true,

#### Response:

```json
{
    "statusCode": 200,
    "data":
        {
        "_id": "693655b55c1fdea7cf2cc2c4",
        "user": "693655b55c1fdea7cf2cc2c2",
        "fullName": "Super Admin",
        "email": "contact.mdselim.dev@gmail.com",
        "visitedPlaces": [
            "Dhaka",
            "Nilphamary",
            "Mymensingh"
        ],
        ....
    },
    "message": "Users retrieved successfully",
    "success": true
}
```

#### 7. Get Me User

- method: `GET` api endpoint: http://localhost:5000/api/v1/user/me

## Description

**credentials**: true,

#### Response:

```json
{
    "statusCode": 200,
    "data":
        {
        "_id": "693655b55c1fdea7cf2cc2c4",
        "user": "693655b55c1fdea7cf2cc2c2",
        "fullName": "Super Admin",
        "email": "contact.mdselim.dev@gmail.com",
        "visitedPlaces": [
            "Dhaka",
            "Nilphamary",
            "Mymensingh"
        ],
        ....
    },
    "message": "User profile retrieved successfully",
    "success": true
}
```

#### 8. Delete An user

- method: `DELETE` api endpoint: http://localhost:5000/api/v1/user/{objectid}

## Description

**credentials**: true,

#### Response:

```json
{
    "statusCode": 200,
    "data":null,
    "message": "User deleted successfully",
    "success": true
}
```

## Profile Api Description:

#### 1. GET MY PROFILE DATA

- method: `GET` api endpoint: http://localhost:5000/api/v1/profile/me

#### Response:

```json
{
    "message": "Profile fetched successfully.",
    "statusCode": 200,
    "success": true,
    "data": {
        "_id": "69414049960ca41c72e2998f",
        "user": "69414049960ca41c72e2998d",
        "fullName": "Md. Mahabub",
        "email": "ahmedmahabub73@gmail.com",
        "visitedPlaces": [
            "Dhaka",
            "Nilphamary",
            "Mymensingh"
        ],
        "isSubscribed": true,
        "interests": [
            "6941401e960ca41c72e29982",
            "693656f396030ba0219fe0ac",
            "693656e796030ba0219fe0a8"
        ],
        "createdAt": "2025-12-16T11:19:37.888Z",
        "updatedAt": "2025-12-16T11:22:19.244Z",
        "address": "Gafargaon, Mymensingh",
        "bio": "I am hello",
        "contactNumber": "0156654652145",
        "currentLocation": "Mymensingh",
        "profileImage": "https://res.cloudinary.com/dsla2viks/image/upload/v1765884066/images/v5snmdy17r_1765884063673_selim-bg-2-jpg.jpg.jpg",
        "subEndDate": "2026-01-16T11:22:19.244Z",
        "subStartDate": "2025-12-16T11:22:19.244Z"
    }
}
```

#### 2. GET ALL PROFILE DATA

- method: `GET` api endpoint: http://localhost:5000/api/v1/profile

#### Response:

```json
{
    "message": "Profiles fetched successfully",
    "statusCode": 200,
    "success": true,
    "data": [
        {
        "_id": "69414049960ca41c72e2998f",
        "user": "69414049960ca41c72e2998d",
        "fullName": "Md. Mahabub",
        "email": "ahmedmahabub73@gmail.com",
        "visitedPlaces": [
            "Dhaka",
            "Nilphamary",
            "Mymensingh"
        ],
        "isSubscribed": true,
        ....,
    },
    ....
    ]
}
```

#### 3. GET PROFILE BY USER ID

- method: `GET` api endpoint: http://localhost:5000/api/v1/profile/{userid}

#### Response:

```json
{
    "message": "Profiles fetched successfully",
    "statusCode": 200,
    "success": true,
    "data": {
        "_id": "69414049960ca41c72e2998f",
        "user": "69414049960ca41c72e2998d",
        "fullName": "Md. Mahabub",
        "email": "ahmedmahabub73@gmail",
        .....
    }
}
```

## Auth Api Description:

- Auth login, logout, change password, reset password,verify email, forgot password method.

#### 1. Auth LogIn

- method: `POST` api endpoint: http://localhost:5000/api/v1/auth/login

##### Description

**credentials**: true,

##### schema design:

```json
{
    "email": string,
    "password":string,
}
```

##### Request:

```json
{
    "email": "selimakondo58@gmail.com",
    //Password should be min 8 char length & 1 uppercase & lowercase & special character
    "password":"Ss@12345",
}
```

#### Response:

```json
{
    "message": "User Logged In Successfully.",
    "statusCode": 200,
    "success": true,
    "data": {
        "_id": "69414049960ca41c72e2998d",
        "email": "ahmedmahabub73@gmail.com",
        "role": "USER",
        "isActive": "ACTIVE",
        "isProfileCompleted": true,
        "isVerified": true,
        "accessToken":"eyJhbGciOiJ",
        "refreshToken":"eyJ"
    }
}
```

#### 2. Auth LogOut

- method: `POST` api endpoint: http://localhost:5000/api/v1/auth/logout

##### Description

**credentials**: true

#### Response:

```json
{
    "message": "User Logged Out Successfully.",
    "statusCode": 200,
    "success": true,
    "data": null
}
```

#### 3. Reset Password

- method: `POST` api endpoint: http://localhost:5000/api/v1/auth/reset-password

##### Description

**credentials**: true,

##### schema design:

```json
{
    "token": string,
    "password":string,
}
```

##### Request:

```json
{
    "token": "eyJhbGciOiJ",
    //Password should be min 8 char length & 1 uppercase & lowercase & special character
    "password":"Ss@12345",
}
```

#### Response:

```json
{
    "message": "Password Reset Successfully.",
    "statusCode": 200,
    "success": true,
    "data":null
}
```

#### 4. Change Password

- method: `POST` api endpoint: http://localhost:5000/api/v1/auth/change-password

##### Description

**credentials**: true,

##### schema design:

```json
{
    "oldPassword": string,
    "newPassword":string,
}
```

##### Request:

```json
{
    "oldPassword": "Ss@12345",
    //Password should be min 8 char length & 1 uppercase & lowercase & special character
    "newPassword":"Ss@12348",
}
```

#### Response:

```json
{
    "message": "Password changed successfully.",
    "statusCode": 200,
    "success": true,
    "data":null
}
```

#### 5. Verify Email Send

- method: `POST` api endpoint: http://localhost:5000/api/v1/auth/verify-email-send

##### schema design:

```json
{
    "email": string,
}
```

##### Request:

```json
{
    "email": "example@gmail.com",
}
```

#### Response:

```json
{
    "message": "Email verification code sent successfully.",
    "statusCode": 200,
    "success": true,
    "data":null
}
```

#### 6. Verify Email

- method: `POST` api endpoint: http://localhost:5000/api/v1/auth/verify-email

##### schema design:

```json
{
    "email": "example@gmail.com",
    //6 digit input
    "otp": "123456",
}
```

##### Request:

```json
{

    "email": string,
    "otp": string,
}
```

#### Response:

```json
{
    "message": "Email verified successfully.",
    "statusCode": 200,
    "success": true,
    "data":null
}
```

#### 7. Forgot Password

- method: `POST` api endpoint: http://localhost:5000/api/v1/auth/forgot-password

##### schema design:

```json
{
    "email": string,
}
```

##### Request:

```json
{
    "email": "example@gmail.com",
}
```

#### Response:

```json
{
    "message": "Forgot Password Email Send Successfully.",
    "statusCode": 200,
    "success": true,
    "data":null
}
```

#### 8. Forgot Password

- method: `POST` api endpoint: http://localhost:5000/api/v1/auth/refresh-token

##### Description

**credentials**: true,

#### Response:

```json
{
    "message": "RefreshToken Undo Successfully.",
    "statusCode": 200,
    "success": true,
    "data":{
        "accessToken":"eyJhbGciOiJ.....",
        "refreshToken":"eyJ...."
    }
}
```

## Travel Type Api Description:

- Travel Type CRUD.

#### 1. CREATE TRAVEL TYPE

- method: `POST` api endpoint: http://localhost:5000/api/v1/travel-type

##### Description

**credentials**: true,
**user role**: SUPER_ADMIN, ADMIN

##### schema design:

```json
{
    //min 3 characters
    "typeName": string,
}
```

##### Request:

```json
{
    "typeName": "Hiking",
}
```

#### Response:

```json
{
    "message": "Travel type created successfully",
    "statusCode": 201,
    "success": true,
    "data": {
        "_id": "69414049960ca41c72e2998d",
        "typeName": "Hiking",
    }
}
```

#### 2. UPDATE TRAVEL TYPE

- method: `PATCH` api endpoint: http://localhost:5000/api/v1/travel-type/{travel-type-objectid}

##### Description

**credentials**: true,
**user role**: SUPER_ADMIN, ADMIN

##### schema design:

```json
{
    //min 3 characters
    "typeName": string,
}
```

##### Request:

```json
{
    "typeName": "Hiking",
}
```

#### Response:

```json
{
    "message": "Travel type updated successfully",
    "statusCode": 201,
    "success": true,
    "data": {
        "_id": "69414049960ca41c72e2998d",
        "typeName": "Hiking",
    }
}
```

#### 3. GET ALL TRAVEL TYPES

- method: `GET` api endpoint: http://localhost:5000/api/v1/travel-type

##### Description

**pagination** support, query data {limit, page}

#### Response:

```json
{
    "message": "Travel types retrieved successfully",
    "statusCode": 200,
    "success": true,
    "data": [{
        "_id": "69414049960ca41c72e2998d",
        "typeName": "Hiking",
    },...]
}
```

#### 4. GET SINGLE TRAVEL TYPE BY ID

- method: `GET` api endpoint: http://localhost:5000/api/v1/travel-type/{objectid}

#### Response:

```json
{
    "message": "Travel type retrieved successfully",
    "statusCode": 200,
    "success": true,
    "data": {
        "_id": "69414049960ca41c72e2998d",
        "typeName": "Hiking",
    }
}
```

#### 5. DELETE SINGLE TRAVEL TYPE BY ID

- method: `DELETE` api endpoint: http://localhost:5000/api/v1/travel-type/{objectid}

#### Response:

```json
{
    "message": "Travel type deleted successfully",
    "statusCode": 200,
    "success": true,
    "data": null
}
```

## Travel Plan Api Description:

- Travel Plan CRUD.

#### 1. CREATE TRAVEL PLAN

- method: `POST` api endpoint: http://localhost:5000/api/v1/travel-plan

##### Description

**Data Send By**: Form data
**credentials**: true,
**user role**: USER

##### schema design:

```json
{
    //who create travel plan id
    "user": string,
    "travelTitle": string,
    "destination": {
        "city":string,
        "country":string,
    },
    "startDate": Date,
    "endDate": Date,
    "budgetRange": {
        "min":number,
        "max":number,
    },
    //array of travel types objectid
    "travelTypes": [string],
    "travelDescription": string,
    "itinerary": [string],
    //image upload url
    "thumbnail": string
}
```

#### Response:

```json
{
    "message": "Travel Plan created successfully",
    "statusCode": 201,
    "success": true,
    "data": {
        "user":"69414049960ca41c72e2998d",
        "travelTitle": "Cox'bazar Summer Tour",
    "destination": {
        "city":"Cox's bazar",
        "country":"Bangladesh",
    },
    "startDate": "2025-12-27",
    "endDate": "2025-12-30",
    ......
    }
}
```

#### 2. UPDATE TRAVEL PLAN

- method: `PATCH` api endpoint: http://localhost:5000/api/v1/travel-plan/{Objectid}

##### Description

**Data Send By**: Form data
**credentials**: true,
**user role**: USER, ADMIN, SUPER_ADMIN

##### schema design:

```json
{
    //who create travel plan id
    "user": string,
    "travelTitle": string,
    "destination": {
        "city":string,
        "country":string,
    },
    "startDate": Date,
    "endDate": Date,
    "budgetRange": {
        "min":number,
        "max":number,
    },
    //array of travel types objectid
    "travelTypes": [string],
    "travelDescription": string,
    "itinerary": [string],
    //image upload url
    "thumbnail": string,
    //travel plan status will be COMPLETED, UPCOMING, CANCELLED
    "travelPlanStatus": string
}
```

#### Response:

```json
{
    "message": "Travel Plan updated successfully",
    "statusCode": 201,
    "success": true,
    "data": {
        "user":"69414049960ca41c72e2998d",
        "travelTitle": "Cox'bazar Summer Tour",
    "destination": {
        "city":"Cox's bazar",
        "country":"Bangladesh",
    },
    "startDate": "2025-12-27",
    "endDate": "2025-12-30",
    ......
    }
}
```

#### 3. GET ALL TRAVEL PLANS

- method: `GET` api endpoint: http://localhost:5000/api/v1/travel-plan

##### Description

**pagination** support, query data {limit, page, search, date range, and travel types}

#### Response:

```json
{
    "message": "Travel Plans retrieved successfully",
    "statusCode": 200,
    "success": true,
    "data": [
    {
        "user":"69414049960ca41c72e2998d",
        "travelTitle": "Cox'bazar Summer Tour",
        "destination": {
            "city":"Cox's bazar",
            "country":"Bangladesh",
        },
        "startDate": "2025-12-27",
        "endDate": "2025-12-30",
    ......
    },
    ...]
}
```

#### 4. GET SINGLE TRAVEL PLAN BY ID

- method: `GET` api endpoint: http://localhost:5000/api/v1/travel-plan/{objectid}

#### Response:

```json
{
    "message": "Travel Plan retrieved successfully",
    "statusCode": 200,
    "success": true,
    "data": {
        "user":"69414049960ca41c72e2998d",
        "travelTitle": "Cox'bazar Summer Tour",
        "destination": {
            "city":"Cox's bazar",
            "country":"Bangladesh",
        },
        "startDate": "2025-12-27",
        "endDate": "2025-12-30",
    ......
    },
}
```

#### 5. GET MY TRAVEL PLANS

- method: `GET` api endpoint: http://localhost:5000/api/v1/travel-plan/my-plans

##### Description

**pagination** support, query data {limit, page, search, date range, and travel types}

#### Response:

```json
{
    "message": "My Travel Plans retrieved successfully",
    "statusCode": 200,
    "success": true,
    "data": [
    {
        "user":"69414049960ca41c72e2998d",
        "travelTitle": "Cox'bazar Summer Tour",
        "destination": {
            "city":"Cox's bazar",
            "country":"Bangladesh",
        },
        "startDate": "2025-12-27",
        "endDate": "2025-12-30",
    ......
    },
    ...]
}
```

#### 6. GET MY MATCHES TRAVEL PLANS

- method: `GET` api endpoint: http://localhost:5000/api/v1/travel-plan/my-matches

#### Response:

```json
{
    "message": "My Matches Travel Plans retrieved successfully",
    "statusCode": 200,
    "success": true,
    "data": [
    {
        "user":"69414049960ca41c72e2998d",
        "travelTitle": "Cox'bazar Summer Tour",
        "destination": {
            "city":"Cox's bazar",
            "country":"Bangladesh",
        },
        "startDate": "2025-12-27",
        "endDate": "2025-12-30",
    ......
    },
    ...]
}
```

#### 7. GET ALL CITIES FOR SEARCH HERO

- method: `GET` api endpoint: http://localhost:5000/api/v1/travel-plan/cities

#### Response:

```json
{
    "message": "Travel Plans cities retrieved successfully",
    "statusCode": 200,
    "success": true,
    "data": [
        "Dhaka",
         "Sylhet",
     ...]
}
```

#### 8. DELETE TRAVEL PLAN BY ID

- method: `DELETE` api endpoint: http://localhost:5000/api/v1/travel-plan/{ojbectid}

#### Response:

```json
{
    "message": "Travel Plan deleted successfully",
    "statusCode": 200,
    "success": true,
    "data": null
}
```

## Subscription Api Description:

- Subscription CRUD.

#### 1. CREATE SUBSCRIPTION

- method: `POST` api endpoint: http://localhost:5000/api/v1/subscription/create

##### Description

**credentials**: true,
**user role**: ADMIN, SUPER_ADMIN

##### schema design:

```json
{
    //MONTHLY OR YEARLY
    "plan": string,
    "price": number,
    //BDT
    "currency": string,
    //(Optional)
    "discount": number;
}
```

##### Requested Data:

```json
{
    //MONTHLY OR YEARLY
    "plan": "MONTHLY",
    "price": 500,
    //BDT
    "currency": "BDT",
    //(Optional)
    "discount": number;
}
```

#### Response:

```json
{
    "message": "Subscription plan created successfully",
    "statusCode": 201,
    "success": true,
    "data": {
        "plan": "MONTHLY",
        "price": 500,
        "currency": "BDT",
    }
}
```

#### 2. UPDATE SUBSCRIPTION

- method: `PATCH` api endpoint: http://localhost:5000/api/v1/subscription/{objectid}

##### Description

**credentials**: true,
**user role**: ADMIN, SUPER_ADMIN

##### schema design:

```json
{
    //MONTHLY OR YEARLY
    "plan": string,
    "price": number,
    //BDT
    "currency": string,
    //(Optional)
    "discount": number;
}
```

##### Requested Data:

```json
{
    //MONTHLY OR YEARLY
    "plan": "MONTHLY",
    "price": 700,
    //BDT
    "currency": "BDT",
    //(Optional) %
    "discount": 10;
}
```

#### Response:

```json
{
    "message": "Subscription plan updated successfully",
    "statusCode": 200,
    "success": true,
    "data": {
        "plan": "MONTHLY",
        "price": 700,
        "currency": "BDT",
    }
}
```

#### 3. GET ALL SUBSCRIPTION

- method: `GET` api endpoint: http://localhost:5000/api/v1/subscription

#### Response:

```json
{
    "message": "subscription plans retrieved successfully",
    "statusCode": 200,
    "success": true,
    "data": [
    {
        "plan": "MONTHLY",
        "price": 700,
        "currency": "BDT",
        "discount": 10
     },
     ...
    ]
}
```

#### 4. GET SINGLE SUBSCRIPTION BY ID

- method: `GET` api endpoint: http://localhost:5000/api/v1/subscription/{objectid}

#### Response:

```json
{
    "message": "subscription plan retrieved successfully",
    "statusCode": 200,
    "success": true,
    "data": {
        "plan": "MONTHLY",
        "price": 700,
        "currency": "BDT",
        "discount": 10
     }
}
```

#### 5. DELETE SINGLE SUBSCRIPTION BY ID

- method: `DELETE` api endpoint: http://localhost:5000/api/v1/subscription/{objectid}

##### Description

**credentials**: true,

**user role**: ADMIN, SUPER_ADMIN

#### Response:

```json
{
    "message": "Subscription plan deleted successfully",
    "statusCode": 200,
    "success": true,
    "data": null
}
```

## Matches Api Description:

- Matches CRUD.

#### 1. CREATE A MATCH

- method: `POST` api endpoint: http://localhost:5000/api/v1/matches/create

##### Description

**credentials**: true,

**user role**: USER

##### schema design:

```json
{
    "travelPlanId": string,
    "senderId": string,
    "receiverId": string,
}
```

##### Requested Data:

```json
{
    "travelPlanId": "693655b55c1fdea7cf2cc2c4",
    "senderId": "693655b55c1fdea7cf2cc2c4",
    "receiverId": "693655b55c1fdea7cf2cc2c4",
}
```

#### Response:

```json
{
    "message": "Match created successfully",
    "statusCode": 201,
    "success": true,
    "data": {
        "_id":"693655b55c1fdea7cf2cc2c4",
        "travelPlanId": "693655b55c1fdea7cf2cc2c4",
        "senderId": "693655b55c1fdea7cf2cc2c4",
        "receiverId": "693655b55c1fdea7cf2cc2c4",
        "status":"REQUESTED"
    }
}
```

#### 2. UPDATE MATCH STATUS

- method: `PATCH` api endpoint: http://localhost:5000/api/v1/matches/{ojbectid}

##### Description

**credentials**: true,

**user role**: USER

##### schema design:

```json
{
    //status value will be (REQUESTED, ACCEPTED, REJECTED)
    "status": string,
}
```

##### Requested Data:

```json
{
     "status": "ACCEPTED",
}
```

#### Response:

```json
{
    "message": "Update match status successfully.",
    "statusCode": 200,
    "success": true,
    "data": {
        "status": "ACCEPTED"
    }
}
```

#### 3. GET MY MATCHES

- method: `GET` api endpoint: http://localhost:5000/api/v1/matches/my-matches

##### Description

**credentials**: true,

**user role**: USER

#### Response:

```json
{
    "statusCode": 200,
    "data": [
        {
            "_id": "694307c3ba8b3afb6bab7450",
            "travelPlanId": {
                "_id": "6941513bd06fa0e36871ac45",
                "user": "69414049960ca41c72e2998d",
                "travelTitle": "Guliakhali Sea Beach",
                "travelPlanStatus": "COMPLETED"
            },
            "senderId": {
                "_id": "693816852ff210ec0b6b4b2c",
                "profile": {
                    "_id": "693816852ff210ec0b6b4b2e",
                    "fullName": "MD. SELIM"
                }
            },
            "receiverId": {
                "_id": "69414049960ca41c72e2998d",
                "profile": {
                    "_id": "69414049960ca41c72e2998f",
                    "fullName": "Md. Mahabub"
                }
            },
            "status": "ACCEPTED",
            "createdAt": "2025-12-17T19:42:59.728Z",
            "updatedAt": "2025-12-17T19:45:14.049Z"
        },
        .....
    ],
    "message": "My matches fetched successfully",
    "success": true
}
```

#### 4. GET SINGLE MATCH

- method: `GET` api endpoint: http://localhost:5000/api/v1/matches/{objectid}

##### Description

**credentials**: true,

**user role**: USER

#### Response:

```json
{
    "success": true,
    "message": "Match fetched successfully",
    "statusCode": 200,
    "data": {
            "_id": "694307c3ba8b3afb6bab7450",
            "travelPlanId": {
                "_id": "6941513bd06fa0e36871ac45",
                "user": "69414049960ca41c72e2998d",
                "travelTitle": "Guliakhali Sea Beach",
                "travelPlanStatus": "COMPLETED"
            },
            "senderId": {
                "_id": "693816852ff210ec0b6b4b2c",
                "profile": {
                    "_id": "693816852ff210ec0b6b4b2e",
                    "fullName": "MD. SELIM"
                }
            },
            "receiverId": {
                "_id": "69414049960ca41c72e2998d",
                "profile": {
                    "_id": "69414049960ca41c72e2998f",
                    "fullName": "Md. Mahabub"
                }
            },
            "status": "ACCEPTED",
            "createdAt": "2025-12-17T19:42:59.728Z",
            "updatedAt": "2025-12-17T19:45:14.049Z"
        }
}
```

#### 5. GET ALL MATCH

- method: `GET` api endpoint: http://localhost:5000/api/v1/matches

##### Description

**credentials**: true,

**user role**: ADMIN, SUPER_ADMIN

#### Response:

```json
{
    "success": true,
    "message": "Matches fetched successfully",
    "statusCode": 200,
    "data": [
        {
            "_id": "694307c3ba8b3afb6bab7450",
            "travelPlanId": {
                "_id": "6941513bd06fa0e36871ac45",
                "user": "69414049960ca41c72e2998d",
                "travelTitle": "Guliakhali Sea Beach",
                "travelPlanStatus": "COMPLETED"
            },
            "senderId": {
                "_id": "693816852ff210ec0b6b4b2c",
                "profile": {
                    "_id": "693816852ff210ec0b6b4b2e",
                    "fullName": "MD. SELIM"
                }
            },
            .....,
        },
        .....
    ],
}
```

## PAYMENT Api Description:

- Payment Init and Payment details find.

#### 1. PAYMENT INIT API

- method: `POST` api endpoint: http://localhost:5000/api/v1/payment/init

##### Description

**credentials**: true,

**user role**: USER

##### schema design:

```json
{
    //subscription and user id
    "subscription": string,
    "user": string,
}
```

##### Requested Data:

```json
{
    "subscription": "693655b55c1fdea7cf2cc2c4",
    "user": "693655b55c1fdea7cf2cc2c4",
}
```

#### Response:

```json
{
    "success": true,
    "message": "Payment initiated successfully",
    "statusCode": 200,
    "data": {
        "paymentUrl": "https://sandbox.sslcommerz.com/gwprocess/v3/gw.php?Q=PAY&SESSIONKEY=527163B4153223778A53531A105A73DC",
        "payment": {
            "user": "69414049960ca41c72e2998d",
            "subscription": "693319e98550700de6b68c74",
            "transactionId": "MJOIQXW1-3AJAT4PY",
            "subscriptionType": "MONTHLY",
            "status": "PENDING",
            "amount": 500,
            "_id": "69500a213d95c216283485dc",
            "createdAt": "2025-12-27T16:32:33.228Z",
            "updatedAt": "2025-12-27T16:32:33.228Z"
        }
    }
}
```

#### 2. GET MY ALL PAYMENTS

- method: `POST` api endpoint: http://localhost:5000/api/v1/payment/me

##### Description

**credentials**: true,

**user role**: USER

#### Response:

```json
{
    "success": true,
    "message": "User payments fetched successfully",
    "statusCode": 200,
    "data": [
      {
        "paymentUrl": "https://sandbox.sslcommerz.com/gwprocess/v3/gw.php?Q=PAY&SESSIONKEY=527163B4153223778A53531A105A73DC",
        "payment": {
            "user": "69414049960ca41c72e2998d",
            "subscription": "693319e98550700de6b68c74",
            "transactionId": "MJOIQXW1-3AJAT4PY",
            "subscriptionType": "MONTHLY",
            "status": "PENDING",
            "amount": 500,
            "_id": "69500a213d95c216283485dc",
            "createdAt": "2025-12-27T16:32:33.228Z",
            "updatedAt": "2025-12-27T16:32:33.228Z"
        }
       },
       ....
    ]
}
```

#### 3. IF PAYMENT FAIL, SUCCESS OR CANCEL FRONTEND LINK

**PAYMENT FAILED LINK**: `${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`

**PAYMENT SUCCESS LINK**: `${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`

**PAYMENT CANCEL LINK**: `${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`

## Review Api Description:

- User can create an account with name, email, password, role (User|Agent) type.

#### 1. Review create api

- method: `POST` api endpoint: http://localhost:5000/api/v1/review/create

##### schema design:

```json
{
    //travel plan objectid
    "travelPlan": string,
    //reviewer user  objectid
    "reviewer": string,
    //reviewed user objectid
    "reviewed": string,
    "rating": number,
    "description": string
}
```

##### Request:

```json
{
    {
    "travelPlan": "693c8c517d1ef46dd9d41056",
    "reviewer": "69382bb9768e05f8ef61619a",
    "reviewed": "693816852ff210ec0b6b4b2c",
    "rating": 4,
    "description": "Very good experience with this arranger."
}
}
```

#### Response:

```json
{
    "message": "Review created successfully",
    "statusCode": 201,
    "success": true,
    "data": {
    "travelPlan": "693c8c517d1ef46dd9d41056",
    "reviewer": "69382bb9768e05f8ef61619a",
    "reviewed": "693816852ff210ec0b6b4b2c",
    "rating": 4,
    "description": "Very good experience with this arranger."
    }
}
```

#### 2. Review Update api

- method: `PATCH` api endpoint: http://localhost:5000/api/v1/review/{objectid}

##### Request:

```json
{
{
    "rating": 4,
    "description": "Very good experience with this arranger."
}
}
```

#### Response:

```json
{
    "message": "Review updated successfully",
    "statusCode": 200,
    "success": true,
    "data": {
    "travelPlan": "693c8c517d1ef46dd9d41056",
    "reviewer": "69382bb9768e05f8ef61619a",
    "reviewed": "693816852ff210ec0b6b4b2c",
    "rating": 4,
    "description": "Very good experience with this arranger."
    }
}
```

#### 3. Get my Reviews

- method: `GET` api endpoint: http://localhost:5000/api/v1/review/my-reviews

#### Response:

```json
{
    "message": "My reviews fetched successfully",
    "statusCode": 200,
    "success": true,
    "data": [
        {
            "_id": "69594dc0e1492856138a654a",
            "travelPlan": {
                "_id": "693c8c517d1ef46dd9d41056",
                "travelTitle": "Sundarbans Wildlife Adventure Dev One"
            },
            "reviewer": {
                "_id": "693816852ff210ec0b6b4b2c",
                "profile": {
                    "_id": "693816852ff210ec0b6b4b2e",
                    "fullName": "MD. SELIM"
                }
            },
            "reviewed": {
                "_id": "69382bb9768e05f8ef61619a",
                "profile": {
                    "_id": "69382bb9768e05f8ef61619c",
                    "fullName": "MD. SELIM 67"
                }
            },
            "description": "Very Good Aranger",
            "rating": 5,
            "createdAt": "2026-01-03T17:11:28.819Z",
            "updatedAt": "2026-01-03T17:11:28.819Z"
        },
        ...
    ]
}
```

#### 4. Get Specific Travel Plan Reviews by travel id

- method: `GET` api endpoint: http://localhost:5000/api/v1/review/travel-plan/{travelObjectid}

#### Response:

```json
{
    "message": "Travel plan reviews fetched successfully",
    "statusCode": 200,
    "success": true,
    "data": [
        {
            "_id": "69594dc0e1492856138a654a",
            "travelPlan": {
                "_id": "693c8c517d1ef46dd9d41056",
                "travelTitle": "Sundarbans Wildlife Adventure Dev One"
            },
            "reviewer": {
                "_id": "693816852ff210ec0b6b4b2c",
                "profile": {
                    "_id": "693816852ff210ec0b6b4b2e",
                    "fullName": "MD. SELIM"
                }
            },
            "reviewed": {
                "_id": "69382bb9768e05f8ef61619a",
                "profile": {
                    "_id": "69382bb9768e05f8ef61619c",
                    "fullName": "MD. SELIM 67"
                }
            },
            "description": "Very Good Aranger",
            "rating": 5,
            "createdAt": "2026-01-03T17:11:28.819Z",
            "updatedAt": "2026-01-03T17:11:28.819Z"
        },
        ...
    ]
}
```

#### 5. Get All Reviews

- method: `GET` api endpoint: http://localhost:5000/api/v1/review

#### Response:

```json
{
    "message": "Reviews fetched successfully",
    "statusCode": 200,
    "success": true,
    "data": [
        {
            "_id": "69594dc0e1492856138a654a",
            "travelPlan": {
                "_id": "693c8c517d1ef46dd9d41056",
                "travelTitle": "Sundarbans Wildlife Adventure Dev One"
            },
            "reviewer": {
                "_id": "693816852ff210ec0b6b4b2c",
                "profile": {
                    "_id": "693816852ff210ec0b6b4b2e",
                    "fullName": "MD. SELIM"
                }
            },
            "reviewed": {
                "_id": "69382bb9768e05f8ef61619a",
                "profile": {
                    "_id": "69382bb9768e05f8ef61619c",
                    "fullName": "MD. SELIM 67"
                }
            },
            "description": "Very Good Aranger",
            "rating": 5,
            "createdAt": "2026-01-03T17:11:28.819Z",
            "updatedAt": "2026-01-03T17:11:28.819Z"
        },
        ...
    ]
}
```

#### 6. Get All Reviews

- method: `GET` api endpoint: http://localhost:5000/api/v1/review

#### Response:

```json
{
    "message": "Reviews fetched successfully",
    "statusCode": 200,
    "success": true,
    "data": [
        {
            "_id": "69594dc0e1492856138a654a",
            "travelPlan": {
                "_id": "693c8c517d1ef46dd9d41056",
                "travelTitle": "Sundarbans Wildlife Adventure Dev One"
            },
            "reviewer": {
                "_id": "693816852ff210ec0b6b4b2c",
                "profile": {
                    "_id": "693816852ff210ec0b6b4b2e",
                    "fullName": "MD. SELIM"
                }
            },
            "reviewed": {
                "_id": "69382bb9768e05f8ef61619a",
                "profile": {
                    "_id": "69382bb9768e05f8ef61619c",
                    "fullName": "MD. SELIM 67"
                }
            },
            "description": "Very Good Aranger",
            "rating": 5,
            "createdAt": "2026-01-03T17:11:28.819Z",
            "updatedAt": "2026-01-03T17:11:28.819Z"
        },
        ...
    ]
}
```

#### 7. Get Single Review by id

- method: `GET` api endpoint: http://localhost:5000/api/v1/review/{objectid}

#### Response:

```json
{
    "message": "Review fetched successfully",
    "statusCode": 200,
    "success": true,
    "data":{
            "_id": "69594dc0e1492856138a654a",
            "travelPlan": {
                "_id": "693c8c517d1ef46dd9d41056",
                "travelTitle": "Sundarbans Wildlife Adventure Dev One"
            },
            "reviewer": {
                "_id": "693816852ff210ec0b6b4b2c",
                "profile": {
                    "_id": "693816852ff210ec0b6b4b2e",
                    "fullName": "MD. SELIM"
                }
            },
            "reviewed": {
                "_id": "69382bb9768e05f8ef61619a",
                "profile": {
                    "_id": "69382bb9768e05f8ef61619c",
                    "fullName": "MD. SELIM 67"
                }
            },
            "description": "Very Good Aranger",
            "rating": 5,
            "createdAt": "2026-01-03T17:11:28.819Z",
            "updatedAt": "2026-01-03T17:11:28.819Z"
        }
}
```

## Contact Form Api:

- User can send email for support or contact.

#### 1. Send Email Api

- method: `POST` api endpoint: http://localhost:5000/api/v1/contact/send

##### schema design:

```json
{
    "name":string,
    "email":string,
    "subject": string,
    "message":string;
}
```

##### Request:

```json
{
    "name":"Md. Seim",
    "email":"selimakondo58@gmail.com",
    "subject": "need some help.",
    "message":"need some help."
}
```

#### Response:

```json
{
    "statusCode": 200,
    "data": null,
    "message": "Contact Form Submitted Successfully.",
    "success": true
}
```

## Stats Api Description:

- Get dashboard stats for user and admin

#### 1. PAYMENT INIT API

- method: `GET` api endpoint: http://localhost:5000/api/v1/stats

##### Description

**credentials**: true,

**route access role**: USER, ADMIN, SUPER_ADMIN

### if user is general user

#### Response:

```json
{
    "statusCode": 200,
    "data": {
        "overview": {
            "totalTravelPlans": 3,
            "upcomingTravelPlans": 1,
            "completedTravelPlans": 1,
            "cancelledTravelPlans": 1,
            "totalCountries": 0,
            "totalCities": 0
        },
        "travelPlansByStatus": [],
        "travelPlansOverTime": [],
        "destinationsVisited": [],
        "budgetAnalysis": {
            "totalBudget": 0,
            "averageBudgetPerTrip": 0
        },
        "budgetByMonth": [],
        "travelTypeDistribution": [],
        "socialMetrics": {
            "matchesSent": 2,
            "matchesReceived": 2,
            "matchesAccepted": 4,
            "matchesRejected": 0,
            "acceptanceRate": "200.00",
            "averageRating": 5,
            "totalReviews": 2
        },
        "reviewsReceived": [],
        "upcomingTrips": [
            {
                "_id": "696cc34aef3445b646e1ed8e",
                "travelTitle": "Panchagar Kanchon Jonga Tour With Family",
                "destination": {
                    "city": "Panchagar",
                    "country": "Bangladesh"
                },
                "startDate": "2026-03-24T00:00:00.000Z",
                "endDate": "2026-03-27T00:00:00.000Z",
                "thumbnail": "https://res.cloudinary.com/dsla2viks/image/upload/v1768735559/images/u98m0n3at2s_1768735559769_kanchonjonga-jpg.jpg.jpg",
                "travelPlanStatus": "UPCOMING"
            }
        ],
        "tripDurationDistribution": [],
        "travelFrequencyByMonth": []
    },
    "message": "Stats fetched successfully",
    "success": true
}
```

### if user is general admin or super_admin

#### Response:

```json
{
    "statusCode": 200,
    "data": {
        "overview": {
            "totalTravelPlans": 9,
            "totalUsers": 7,
            "totalAdmins": 1,
            "totalRegularUsers": 5,
            "totalSubscribedUsers": 6,
            "totalMatches": 4,
            "totalReviews": 5,
            "totalRevenue": 7100,
            "pendingPayments": 1500,
            "pendingPaymentCount": 3
        },
        "userGrowth": [
            {
                "count": 5,
                "month": "2025-12"
            },
            {
                "count": 2,
                "month": "2026-1"
            }
        ],
        "travelPlanGrowth": [
            {
                "count": 3,
                "month": "2025-12"
            },
            {
                "count": 6,
                "month": "2026-1"
            }
        ],
        "travelPlansByStatus": [
            {
                "count": 2,
                "status": "CANCELLED"
            },
            {
                "count": 3,
                "status": "COMPLETED"
            },
            {
                "count": 4,
                "status": "UPCOMING"
            }
        ],
        "matchesByStatus": [
            {
                "count": 4,
                "status": "ACCEPTED"
            }
        ],
        "topDestinations": [
            {
                "count": 4,
                "city": "Sundarbans",
                "country": "Bangladesh"
            },
            {
                "count": 1,
                "city": "Sitakunda",
                "country": "Chittagong"
            },
            {
                "count": 1,
                "city": "Pangchagar",
                "country": "Bangladesh"
            },
            {
                "count": 1,
                "city": "Saint Martin",
                "country": "Bangladesh"
            },
            {
                "count": 1,
                "city": "Panchagar",
                "country": "Bangladesh"
            },
            {
                "count": 1,
                "city": "Cox Bazar",
                "country": "Bangladesh"
            }
        ],
        "topTravelTypes": [
            {
                "count": 25,
                "name": null
            }
        ],
        "revenueByPlan": [
            {
                "count": 1,
                "plan": "YEARLY",
                "revenue": 3000
            },
            {
                "count": 8,
                "plan": "MONTHLY",
                "revenue": 4100
            }
        ],
        "revenueGrowth": [
            {
                "amount": 3000,
                "count": 6,
                "month": "2025-12"
            },
            {
                "amount": 4100,
                "count": 3,
                "month": "2026-1"
            }
        ],
        "paymentsByStatus": [
            {
                "count": 9,
                "totalAmount": 7100,
                "status": "PAID"
            },
            {
                "count": 1,
                "totalAmount": 500,
                "status": "CANCELLED"
            },
            {
                "count": 1,
                "totalAmount": 500,
                "status": "FAILED"
            },
            {
                "count": 3,
                "totalAmount": 1500,
                "status": "PENDING"
            }
        ],
        "topRatedUsers": [
            {
                "fullName": "MD. SELIM",
                "profileImage": "https://res.cloudinary.com/dsla2viks/image/upload/v1767460351/images/rvdogb2ckvp_1767460350108_ronaldo-png.png.png",
                "userId": "693816852ff210ec0b6b4b2c",
                "rating": 5,
                "reviewCount": 2
            },
            {
                "fullName": "Md. Mahabub 73",
                "profileImage": "https://res.cloudinary.com/dsla2viks/image/upload/v1765884066/images/v5snmdy17r_1765884063673_selim-bg-2-jpg.jpg.jpg",
                "userId": "69414049960ca41c72e2998d",
                "rating": 5,
                "reviewCount": 1
            },
            {
                "fullName": "mdselim",
                "profileImage": "https://res.cloudinary.com/dsla2viks/image/upload/v1767985867/images/t1mtcg3hlom_1767985866914_selim-bg-2-jpg.jpg.jpg",
                "userId": "69614fd6af707391e907724c",
                "rating": 5,
                "reviewCount": 1
            },
            {
                "fullName": "MD. SELIM 67",
                "profileImage": "https://res.cloudinary.com/dsla2viks/image/upload/v1765460526/images/44acs1hb5yd_1765460525169_gentelman-png.png.png",
                "userId": "69382bb9768e05f8ef61619a",
                "rating": 4,
                "reviewCount": 1
            }
        ],
        "mostActiveUsers": [
            {
                "travelPlanCount": 3,
                "userId": "693816852ff210ec0b6b4b2c",
                "fullName": "MD. SELIM",
                "profileImage": "https://res.cloudinary.com/dsla2viks/image/upload/v1767460351/images/rvdogb2ckvp_1767460350108_ronaldo-png.png.png"
            },
            {
                "travelPlanCount": 2,
                "userId": "69414049960ca41c72e2998d",
                "fullName": "Md. Mahabub 73",
                "profileImage": "https://res.cloudinary.com/dsla2viks/image/upload/v1765884066/images/v5snmdy17r_1765884063673_selim-bg-2-jpg.jpg.jpg"
            },
            {
                "travelPlanCount": 2,
                "userId": "69614fd6af707391e907724c",
                "fullName": "mdselim",
                "profileImage": "https://res.cloudinary.com/dsla2viks/image/upload/v1767985867/images/t1mtcg3hlom_1767985866914_selim-bg-2-jpg.jpg.jpg"
            },
            {
                "travelPlanCount": 1,
                "userId": "693655b55c1fdea7cf2cc2c2",
                "fullName": "Super Admin",
                "profileImage": "https://res.cloudinary.com/dsla2viks/image/upload/v1767982811/images/pu4tj4ncvbk_1767982810987_selim-bg-2-png.png.png"
            },
            {
                "travelPlanCount": 1,
                "userId": "69624518a74818cefb4a2fcf",
                "fullName": "md selim",
                "profileImage": "https://res.cloudinary.com/dsla2viks/image/upload/v1768642332/images/pd8b06iaz9i_1768642329712_gen-1767301655118-png.png.jpg"
            }
        ]
    },
    "message": "Stats fetched successfully",
    "success": true
}
```

## Development Mode Error Example Schema

#### Response:

```json
{
    "success": false,
    "message": "Review not found",
    "errorSources": [],
    "error": {
        "statusCode": 404
    },
    "stack": "Error: Review not found\n    at F:\\1.Web-Development\\3.Level-2-Course\\16.Final-Project\\travel-buddy-server-site\\src\\app\\modules\\review\\review.service.ts:97:15\n    at Generator.next (<anonymous>)\n    at fulfilled (F:\\1.Web-Development\\3.Level-2-Course\\16.Final-Project\\travel-buddy-server-site\\src\\app\\modules\\review\\review.service.ts:5:58)\n    at processTicksAndRejections (node:internal/process/task_queues:103:5)"
}
```

## Production Mode Error Example Schema

#### Response:

```json
{
    "success": false,
    "message": "Review not found",
    "errorSources": [],
    "error": null,
    "stack": null
}
```
