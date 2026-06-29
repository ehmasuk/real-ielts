Absolutely. For a production IELTS platform with a **Next.js frontend (including admin)** and a **separate backend API**, this is the architecture I would recommend. Below is an SRS-style specification you can directly include in your project documentation.

---

# Authentication & Authorization SRS

Version: 1.0

---

# 1. Overview

The application shall use **Google OAuth** as the only authentication method.

The frontend shall use **Better Auth** solely to perform the Google OAuth flow.

The backend shall be the **single source of truth** for:

* User authentication
* JWT issuance
* Session management
* Authorization
* User roles
* Refresh token management

The frontend shall never trust Google authentication directly.

Instead, the frontend shall exchange Google's ID Token for application-specific JWT tokens issued by the backend.

---

# 2. High Level Architecture

```
                 Google
                    │
                    │ OAuth
                    ▼
           Better Auth (Frontend)
                    │
             Google ID Token
                    │
                    ▼
          POST /api/auth/google
                    │
                    ▼
             Backend API
                    │
       Verify Google ID Token
                    │
      Create/Update Local User
                    │
      Generate Access JWT
      Generate Refresh JWT
                    │
                    ▼
              Frontend
                    │
      Authorization: Bearer JWT
                    │
                    ▼
              Protected APIs
```

---

# 3. Authentication Flow

## Step 1

User clicks

```
Continue with Google
```

Frontend launches Better Auth Google OAuth.

---

## Step 2

Google authenticates user.

Google returns

```
ID Token
```

The ID Token contains

* Google User ID
* Email
* Name
* Avatar
* Email Verified
* Expiration

---

## Step 3

Frontend sends

```
POST /api/auth/google
```

Body

```json
{
    "idToken": "<google-id-token>"
}
```

No JWT is sent yet.

---

## Step 4

Backend verifies

* Signature
* Issuer
* Audience
* Expiration
* Email verified

If verification fails

Return

```
401 Unauthorized
```

---

## Step 5

Backend extracts

```
Google ID
Email
Name
Picture
```

---

## Step 6

Backend searches

```
User.googleId
```

If user exists

Load user.

Otherwise

Create user.

---

## Step 7

Backend generates

Access Token

Refresh Token

Returns

```json
{
    "accessToken": "...",
    "user": {
        "id": 12,
        "name": "John",
        "email": "john@gmail.com",
        "role": "student"
    }
}
```

Refresh Token shall be stored in an HttpOnly cookie.

---

# 4. Google Identity

The backend shall use Google's

```
sub
```

claim as the permanent external identifier.

Example

```
sub

109483274982347234
```

The application shall never use email as the primary identity.

Emails may change.

Google IDs do not.

---

# 5. Local User Model

```
User
```

Fields

```
id
googleId
email
name
picture
role
status
createdAt
updatedAt
lastLoginAt
```

Role

```
student
admin
```

Status

```
active
disabled
banned
```

---

# 6. JWT Strategy

Backend shall issue two tokens.

---

## Access Token

Lifetime

```
15 minutes
```

Contains

```json
{
    "sub": 12,
    "role": "student",
    "iat": 123,
    "exp": 456
}
```

Purpose

Authentication.

---

## Refresh Token

Lifetime

```
30 days
```

Purpose

Issue new access tokens.

Refresh Token shall never be used to access APIs.

---

# 7. Refresh Token Storage

Refresh Token shall

* be stored in database
* be hashed before storage
* support revocation

Fields

```
id
userId
hashedToken
expiresAt
createdAt
revokedAt
ipAddress
userAgent
```

---

# 8. Client Storage

## Access Token

May be stored

```
Memory
```

or

```
Secure Cookie
```

Preferred

```
Memory
```

---

## Refresh Token

Stored only

```
HttpOnly Cookie
```

Accessible

NO

JavaScript

NO

---

# 9. Authorization Header

Every protected request

```
Authorization

Bearer ACCESS_TOKEN
```

Backend verifies JWT.

If expired

```
401 Unauthorized
```

---

# 10. Refresh Flow

When Access Token expires

Frontend calls

```
POST /auth/refresh
```

No body required.

Browser automatically sends Refresh Cookie.

Backend

Verifies Refresh Token

Creates new Access Token

Returns

```json
{
    "accessToken":"..."
}
```

---

# 11. Logout

Frontend calls

```
POST /auth/logout
```

Backend

Deletes Refresh Token

Expires Cookie

Returns

```
204 No Content
```

Access Token naturally expires within 15 minutes.

---

# 12. Session Management

Each login creates a session.

Session

```
id
userId
refreshTokenHash
createdAt
expiresAt
lastUsedAt
ip
device
browser
```

User may have

Multiple Sessions

Example

Laptop

Phone

Tablet

All valid simultaneously.

---

# 13. API Authentication Middleware

Middleware

```
Verify JWT
```

If invalid

```
401
```

If valid

Attach

```
req.user
```

Example

```
req.user.id

req.user.role
```

---

# 14. Authorization

Role-based authorization.

Example

```
Admin

Student
```

Admin endpoint

```
GET /admin/users
```

Requires

```
role == admin
```

Otherwise

```
403 Forbidden
```

---

# 15. Google Login Restrictions

Backend shall reject

* Expired ID Token
* Invalid Audience
* Invalid Issuer
* Invalid Signature
* Unverified Email

---

# 16. User Creation Rules

First Login

```
Create User
```

Second Login

```
Update

name

picture

lastLogin
```

Never duplicate user.

---

# 17. Token Rotation

Each refresh

Old Refresh Token

↓

Revoked

↓

Generate New Refresh Token

↓

Generate New Access Token

This prevents replay attacks.

---

# 18. Security Requirements

### JWT Secret

Minimum

```
256-bit
```

---

### Access Token Expiry

```
15 min
```

---

### Refresh Expiry

```
30 days
```

---

### Cookies

```
HttpOnly

Secure

SameSite=Lax
```

Production

```
Secure=true
```

Development

```
Secure=false
```

---

### HTTPS

All authentication endpoints shall require HTTPS in production.

---

### Passwords

No passwords are stored.

Google OAuth only.

---

### CSRF

Refresh endpoint shall be protected because it relies on cookies. A common approach is to combine `SameSite=Lax` or `Strict` cookies with CSRF protection (such as a CSRF token or Origin/Referer validation) for state-changing requests.

---

### XSS

Never store Refresh Tokens in Local Storage.

---

# 19. Authentication Endpoints

```
POST /auth/google

POST /auth/refresh

POST /auth/logout

GET /auth/me
```

---

## POST /auth/google

Input

```json
{
    "idToken":"..."
}
```

Output

```json
{
    "accessToken":"...",
    "user":{
        "id":1,
        "name":"John",
        "email":"john@gmail.com",
        "role":"student"
    }
}
```

Sets

```
HttpOnly Refresh Cookie
```

---

## POST /auth/refresh

Input

```
Cookie
```

Output

```json
{
    "accessToken":"..."
}
```

---

## POST /auth/logout

Deletes

```
Refresh Cookie

Refresh Session
```

---

## GET /auth/me

Returns

```json
{
    "id":1,
    "email":"john@gmail.com",
    "role":"student"
}
```

---

# 20. Authentication State (Frontend)

The frontend authentication state shall be managed as follows:

```
App Start
    ↓
Call GET /auth/me
    ↓
If Access Token exists and is valid
    ↓
Authenticated
    ↓
Else attempt POST /auth/refresh
    ↓
If refresh succeeds
    ↓
Store new Access Token
    ↓
Authenticated
    ↓
Else
    ↓
Unauthenticated
```

The frontend should **never** determine authentication status based solely on Better Auth's session. It should consider the user authenticated only after obtaining a valid backend-issued access token.

