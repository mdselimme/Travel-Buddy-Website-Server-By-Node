# Travel Buddy Server Site By Node, Express, Ts

Travel Buddy is a website where people can find their desire travel buddy. Like If you are bored and you want to go a tour. So you can post here your tour details. Then who is like you want to go a tour he will see you travel plan details if he is interested in this travel plan then he send you a request to go with you. Also this platform is subscription based. Here have two types subscription Monthly and yearly. If you want to use this website you have to need subscribed first.

Database Relation ERD : [https://drive.google.com/file/d/19kGheUiKry_k2JYtKVL43ewHXwGiB4IW/view?usp=sharing]

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
    - **Data Validation & Security:** Zod, Bcrypt and Moduler Architecture.
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

--

## Api Documentation & Configuration.

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
    "interests":["FARMING","GARDENING"],
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

## Auth Module Api Description:

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
