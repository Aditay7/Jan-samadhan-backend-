# Citizen API Testing Documentation

## Overview

This document provides complete testing guide for Citizen APIs in the Jal Samadhan system. These APIs handle citizen registration, authentication, and profile management.

## Base URL

```
http://localhost:3000/api/mobile
```

## API Endpoints

### 1. Send OTP for Registration/Login

**Endpoint:** `POST /api/mobile/send-otp`

**Description:** Sends OTP to the provided phone number. Works for both new registration and existing user login.

**Request Body:**

```json
{
  "phone_number": "9876543210"
}
```

**Request Body Fields:**

- `phone_number` (string, required): 10-digit Indian mobile number

**Response (Success - 200):**

```json
{
  "message": "OTP sent successfully",
  "phone_number": "9876543210",
  "is_existing_user": false,
  "user_id": 123
}
```

**Response Fields:**

- `message` (string): Success message
- `phone_number` (string): The phone number OTP was sent to
- `is_existing_user` (boolean): `true` if user exists, `false` for new registration
- `user_id` (number): User ID (for new users, this is temporary until profile completion)

**Response (Error - 400):**

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "phone_number",
      "message": "Valid phone number is required",
      "value": "invalid_number"
    }
  ]
}
```

**Response (Error - 500):**

```json
{
  "message": "Failed to send OTP"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:3000/api/mobile/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "9876543210"
  }'
```

---

### 2. Verify OTP

**Endpoint:** `POST /api/mobile/verify-otp`

**Description:** Verifies the OTP and determines if user needs to complete profile or can login directly.

**Request Body:**

```json
{
  "phone_number": "9876543210",
  "otp": "123456"
}
```

**Request Body Fields:**

- `phone_number` (string, required): Same phone number used in send-otp
- `otp` (string, required): 6-digit OTP received via SMS

**Response for New User (Success - 200):**

```json
{
  "message": "OTP verified. Please complete your profile.",
  "is_existing_user": false,
  "is_profile_complete": false,
  "user_id": 123,
  "requires_profile_completion": true
}
```

**Response for Existing User (Success - 200):**

```json
{
  "message": "Login successful",
  "is_existing_user": true,
  "is_profile_complete": true,
  "user_id": 123,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 123,
    "name": "John Doe",
    "phone_number": "9876543210",
    "email": "john@example.com",
    "address": "123 Main Street",
    "role": "citizen",
    "permissions": {
      "issue": ["create", "read_own", "update_own"],
      "profile": ["read_own", "update_own"],
      "notification": ["read_own"]
    },
    "is_phone_verified": true
  }
}
```

**Response Fields:**

- `message` (string): Success message
- `is_existing_user` (boolean): Whether user exists in system
- `is_profile_complete` (boolean): Whether user profile is complete
- `user_id` (number): User ID
- `requires_profile_completion` (boolean): Whether profile completion is needed
- `accessToken` (string, optional): JWT access token for authenticated requests
- `refreshToken` (string, optional): JWT refresh token
- `user` (object, optional): Complete user object with profile and permissions

**Response (Error - 400):**

```json
{
  "message": "Invalid or expired OTP"
}
```

**Response (Error - 400):**

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "otp",
      "message": "OTP must be 6 digits",
      "value": "12345"
    }
  ]
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:3000/api/mobile/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "9876543210",
    "otp": "123456"
  }'
```

---

### 3. Complete Profile (New Users Only)

**Endpoint:** `POST /api/mobile/complete-profile`

**Description:** Completes the registration process by adding user details. Only for new users after OTP verification.

**Request Body:**

```json
{
  "user_id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "address": "123 Main Street, City, State"
}
```

**Request Body Fields:**

- `user_id` (number, required): User ID received from verify-otp response
- `name` (string, required): Full name of the citizen
- `email` (string, optional): Email address
- `address` (string, optional): Complete address

**Response (Success - 200):**

```json
{
  "message": "Registration completed successfully",
  "user": {
    "id": 123,
    "name": "John Doe",
    "phone_number": "9876543210",
    "email": "john@example.com",
    "address": "123 Main Street, City, State",
    "role": "citizen",
    "permissions": {
      "issue": ["create", "read_own", "update_own"],
      "profile": ["read_own", "update_own"],
      "notification": ["read_own"]
    },
    "is_phone_verified": true
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Fields:**

- `message` (string): Success message
- `user` (object): Complete user profile
- `accessToken` (string): JWT access token for authenticated requests
- `refreshToken` (string): JWT refresh token

**Response (Error - 400):**

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Name must be at least 2 characters",
      "value": "J"
    }
  ]
}
```

**Response (Error - 500):**

```json
{
  "message": "Phone number not verified"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:3000/api/mobile/complete-profile \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main Street, City, State"
  }'
```

---

### 4. Update Profile (Existing Users)

**Endpoint:** `PUT /api/mobile/update-profile`

**Description:** Updates profile information for existing users. Requires authentication.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "address": "456 New Street, City, State"
}
```

**Request Body Fields:**

- `name` (string, required): Updated full name
- `email` (string, optional): Updated email address
- `address` (string, optional): Updated address

**Response (Success - 200):**

```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 123,
    "name": "John Doe Updated",
    "phone_number": "9876543210",
    "email": "john.updated@example.com",
    "address": "456 New Street, City, State"
  }
}
```

**Response Fields:**

- `message` (string): Success message
- `user` (object): Updated user profile

**Response (Error - 401):**

```json
{
  "message": "Authorization header missing"
}
```

**Response (Error - 400):**

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required",
      "value": "invalid-email"
    }
  ]
}
```

**cURL Example:**

```bash
curl -X PUT http://localhost:3000/api/mobile/update-profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "address": "456 New Street, City, State"
  }'
```

---

### 5. Resend OTP

**Endpoint:** `POST /api/mobile/resend-otp`

**Description:** Resends OTP to the same phone number if the previous OTP expired or wasn't received.

**Request Body:**

```json
{
  "phone_number": "9876543210"
}
```

**Request Body Fields:**

- `phone_number` (string, required): Same phone number used previously

**Response (Success - 200):**

```json
{
  "message": "OTP resent successfully",
  "phone_number": "9876543210",
  "is_existing_user": true,
  "user_id": 123
}
```

**Response Fields:**

- `message` (string): Success message
- `phone_number` (string): The phone number OTP was sent to
- `is_existing_user` (boolean): Whether user exists in system
- `user_id` (number): User ID

**cURL Example:**

```bash
curl -X POST http://localhost:3000/api/mobile/resend-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "9876543210"
  }'
```

---

## Complete Registration Flow Example

### Step 1: New User Registration

```bash
# 1. Send OTP
curl -X POST http://localhost:3000/api/mobile/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "9876543210"}'

# Response:
{
  "message": "OTP sent successfully",
  "phone_number": "9876543210",
  "is_existing_user": false,
  "user_id": 123
}
```

```bash
# 2. Verify OTP (use OTP from console/SMS)
curl -X POST http://localhost:3000/api/mobile/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "9876543210",
    "otp": "123456"
  }'

# Response:
{
  "message": "OTP verified. Please complete your profile.",
  "is_existing_user": false,
  "is_profile_complete": false,
  "user_id": 123,
  "requires_profile_completion": true
}
```

```bash
# 3. Complete Profile
curl -X POST http://localhost:3000/api/mobile/complete-profile \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main Street, City, State"
  }'

# Response:
{
  "message": "Registration completed successfully",
  "user": { ... },
  "accessToken": "...",
  "refreshToken": "..."
}
```

### Step 2: Existing User Login

```bash
# 1. Send OTP (same phone number)
curl -X POST http://localhost:3000/api/mobile/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "9876543210"}'

# Response:
{
  "message": "OTP sent successfully",
  "phone_number": "9876543210",
  "is_existing_user": true,
  "user_id": 123
}
```

```bash
# 2. Verify OTP - Direct Login
curl -X POST http://localhost:3000/api/mobile/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "9876543210",
    "otp": "123456"
  }'

# Response:
{
  "message": "Login successful",
  "is_existing_user": true,
  "is_profile_complete": true,
  "user_id": 123,
  "accessToken": "...",
  "refreshToken": "...",
  "user": { ... }
}
```

## Error Codes

| Status Code | Description                          |
| ----------- | ------------------------------------ |
| 200         | Success                              |
| 400         | Bad Request (validation errors)      |
| 401         | Unauthorized (missing/invalid token) |
| 403         | Forbidden (insufficient permissions) |
| 500         | Internal Server Error                |

## Testing Notes

1. **OTP Display**: During development, OTP is displayed in console logs
2. **Phone Validation**: Supports Indian mobile numbers (10 digits starting with 6-9)
3. **Token Usage**: Use `accessToken` in Authorization header for protected endpoints
4. **Token Expiry**: Access tokens expire in 15 minutes, refresh tokens in 7 days
5. **Profile Completion**: New users must complete profile after OTP verification
6. **Existing Users**: Users with complete profiles can login directly after OTP verification

## Environment Setup

Make sure your `.env` file contains:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/jal_samadhan
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

## Database Setup

Before testing, ensure database is seeded:

```bash
npm run seed:all
```
