# FoodReels Backend API Documentation

## Overview
FoodReels is a full-stack TikTok/Instagram-style reels application with user and food partner authentication, video uploads, likes, comments, and bookmarks functionality.

---

## Base URL
```
http://localhost:3000/api
```

---

## Authentication Routes

### 1. User Registration
**Endpoint:** `POST /auth/user/register`

**Description:** Register a new user account.

**Request Body:**
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "message": "user created successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "firstname": "John",
    "lastname": "Doe"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "User already exists"
}
```

**Notes:**
- Password is hashed using bcryptjs before storage
- JWT token is generated and set as a cookie (httpOnly)
- Email must be unique in the database

---

### 2. User Login
**Endpoint:** `POST /auth/user/login`

**Description:** Authenticate an existing user and return a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login Successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    }
  }
}
```

**Error Response (400/401):**
```json
{
  "message": "User Not found"
}
```
or
```json
{
  "message": "Email and password incorrect"
}
```

---

### 3. User Logout
**Endpoint:** `GET /auth/user/logout`

**Description:** Clear user session by removing the JWT cookie.

**Response (200 OK):**
```json
{
  "message": "User Logout Successfully"
}
```

---

### 4. Food Partner Registration
**Endpoint:** `POST /auth/food-partner/register`

**Description:** Register a new food partner (restaurant/vendor) account.

**Request Body:**
```json
{
  "businessname": "Pizza Palace",
  "contactname": "Marco Rossi",
  "phone": "+1234567890",
  "address": "123 Main St, New York, NY 10001",
  "email": "marco@pizzapalace.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "message": "foodpartner created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "foodpartner": {
    "_id": "507f1f77bcf86cd799439012",
    "email": "marco@pizzapalace.com",
    "businessname": "Pizza Palace",
    "contactname": "Marco Rossi",
    "phone": "+1234567890",
    "address": "123 Main St, New York, NY 10001"
  }
}
```

**Error Response (400):**
```json
{
  "message": "User already exists"
}
```

---

### 5. Food Partner Login
**Endpoint:** `POST /auth/food-partner/login`

**Description:** Authenticate a food partner and return a JWT token.

**Request Body:**
```json
{
  "email": "marco@pizzapalace.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "foodpartner": {
    "_id": "507f1f77bcf86cd799439012",
    "email": "marco@pizzapalace.com",
    "businessname": "Pizza Palace",
    "contactname": "Marco Rossi",
    "phone": "+1234567890",
    "address": "123 Main St, New York, NY 10001"
  }
}
```

**Error Response (400/401):**
```json
{
  "message": "Email and Password Incorrect"
}
```

---

### 6. Food Partner Logout
**Endpoint:** `GET /auth/food-partner/logout`

**Description:** Clear food partner session by removing the JWT cookie.

**Response (200 OK):**
```json
{
  "message": "User Logout Successfully"
}
```

---

## Middleware Documentation

### 1. authUserMiddlewares
**File:** `src/middlewares/auth.MIddlewares.js`

**Purpose:** Validates JWT token and ensures the request is from an authenticated user.

**How It Works:**
1. Extracts JWT token from cookies (`req.cookies.token`)
2. Verifies token using `process.env.JWT_SECRET`
3. Fetches user from database using decoded token ID
4. Attaches user object to `req.user` for downstream handlers

**Usage:**
```javascript
const { authUserMIddlewares } = require('../middlewares/auth.MIddlewares');

router.get('/protected-route', authUserMIddlewares, controller.method);
```

**Error Responses:**

- No Token (401):
```json
{
  "message": "Please Login first"
}
```

- Invalid Token (401):
```json
{
  "message": "Invalid User"
}
```

**Attached to Request:**
```javascript
req.user = {
  _id: "507f1f77bcf86cd799439011",
  fullname: { firstname: "John", lastname: "Doe" },
  email: "john@example.com",
  // ... other user fields
}
```

---

### 2. FoodPartnerMiddlewares
**File:** `src/middlewares/auth.MIddlewares.js`

**Purpose:** Validates JWT token and ensures the request is from an authenticated food partner.

**How It Works:**
1. Extracts JWT token from cookies (`req.cookies.token`)
2. Verifies token using `process.env.JWT_SECRET`
3. Fetches food partner from database using decoded token ID
4. Attaches food partner object to `req.foodPartner` for downstream handlers

**Usage:**
```javascript
const { FoodPartnerMiddlewares } = require('../middlewares/auth.MIddlewares');

router.post('/upload-video', FoodPartnerMiddlewares, controller.uploadVideo);
```

**Error Responses:**

- No Token (401):
```json
{
  "message": "Please Login first"
}
```

- Unauthorized / Partner Not Found (401):
```json
{
  "message": "Unauthorized"
}
```

- Invalid Token (401):
```json
{
  "message": "Invalid Token"
}
```

**Attached to Request:**
```javascript
req.foodPartner = {
  _id: "507f1f77bcf86cd799439012",
  businessname: "Pizza Palace",
  contactname: "Marco Rossi",
  phone: "+1234567890",
  address: "123 Main St, New York, NY 10001",
  email: "marco@pizzapalace.com",
  // ... other partner fields
}
```

---

## Food Routes

### 1. Create Food (Upload Video)
**Endpoint:** `POST /food`

**Authentication:** `FoodPartnerMiddlewares` (Protected - Food Partner only)

**Description:** Upload a new food/reel video.

**Request Body (FormData):**
```
- name: string (required) - Name of the food item
- description: string (required) - Description of the video
- video: file (required) - Video file
```

**Response (201 Created):**
```json
{
  "message": "Food uploaded successfully",
  "foodItem": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Margherita Pizza",
    "description": "Freshly baked with mozzarella and basil",
    "video": "https://storage-url.com/video-uuid",
    "foodPartner": "507f1f77bcf86cd799439012",
    "likeCount": 0,
    "saveCount": 0,
    "createdAt": "2025-11-26T10:30:00Z"
  }
}
```

---

### 2. Get All Foods
**Endpoint:** `GET /food`

**Authentication:** `authUserMIddlewares` (Protected - Users only)

**Description:** Fetch all food/reel videos.

**Response (200 OK):**
```json
{
  "message": "Food Fetched created successfully",
  "foodItem": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Margherita Pizza",
      "description": "Freshly baked with mozzarella and basil",
      "video": "https://storage-url.com/video-uuid",
      "foodPartner": "507f1f77bcf86cd799439012",
      "likeCount": 42,
      "saveCount": 15,
      "createdAt": "2025-11-26T10:30:00Z"
    },
    // ... more foods
  ]
}
```

---

### 3. Like Food
**Endpoint:** `POST /food/like`

**Authentication:** `authUserMIddlewares` (Protected - Users only)

**Description:** Like or unlike a food video. Toggle behavior (like if not liked, unlike if already liked).

**Request Body:**
```json
{
  "foodId": "507f1f77bcf86cd799439013"
}
```

**Response - First Like (201 Created):**
```json
{
  "message": "Liked Successfully",
  "like": {
    "_id": "507f1f77bcf86cd799439014",
    "user": "507f1f77bcf86cd799439011",
    "foodId": "507f1f77bcf86cd799439013"
  }
}
```

**Response - Unlike (200 OK):**
```json
{
  "message": "Food Unliked Successfully"
}
```

**Note:** The `likeCount` on the food item is automatically incremented/decremented.

---

### 4. Save Food (Bookmark)
**Endpoint:** `POST /food/save`

**Authentication:** `authUserMIddlewares` (Protected - Users only)

**Description:** Save or unsave a food video to bookmarks. Toggle behavior.

**Request Body:**
```json
{
  "foodId": "507f1f77bcf86cd799439013"
}
```

**Response - First Save (201 Created):**
```json
{
  "message": "Food saved successfully",
  "save": {
    "_id": "507f1f77bcf86cd799439015",
    "user": "507f1f77bcf86cd799439011",
    "foodId": "507f1f77bcf86cd799439013"
  }
}
```

**Response - Unsave (200 OK):**
```json
{
  "message": "Food Unsaved Successfully"
}
```

**Note:** The `saveCount` on the food item is automatically incremented/decremented.

---

### 5. Get Saved Foods
**Endpoint:** `GET /food/save`

**Authentication:** `authUserMIddlewares` (Protected - Users only)

**Description:** Fetch all saved/bookmarked food videos for the current user.

**Response (200 OK):**
```json
{
  "savedFoods": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "user": "507f1f77bcf86cd799439011",
      "foodId": {
        "_id": "507f1f77bcf86cd799439013",
        "name": "Margherita Pizza",
        "description": "Freshly baked with mozzarella and basil",
        "video": "https://storage-url.com/video-uuid",
        "foodPartner": "507f1f77bcf86cd799439012",
        "likeCount": 42,
        "saveCount": 15
      }
    },
    // ... more saved foods
  ]
}
```

---

## Partner Routes

### 1. Get Partner by ID
**Endpoint:** `GET /foodPartner/:id`

**Description:** Fetch food partner details (business name, contact info, etc.).

**URL Parameters:**
```
id: string (required) - Partner/FoodPartner MongoDB ID
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "businessname": "Pizza Palace",
  "contactname": "Marco Rossi",
  "phone": "+1234567890",
  "address": "123 Main St, New York, NY 10001",
  "email": "marco@pizzapalace.com",
  "createdAt": "2025-11-20T08:15:00Z",
  "updatedAt": "2025-11-26T10:30:00Z"
}
```

**Note:** Password field is excluded from response.

---

## Error Handling

All API errors return appropriate HTTP status codes:

| Status Code | Meaning |
|-------------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource successfully created |
| 400 | Bad Request - Invalid input or resource already exists |
| 401 | Unauthorized - Missing or invalid authentication |
| 500 | Internal Server Error - Server-side issue |

---

## Authentication Flow

### User Authentication
1. User calls `POST /auth/user/register` with fullname, email, password
2. Backend hashes password and creates user in database
3. JWT token is generated and set as HTTP-only cookie
4. User is returned in response
5. For subsequent requests, include the token in cookies (automatic for browser requests)
6. Protected endpoints verify token via `authUserMIddlewares`

### Food Partner Authentication
1. Food Partner calls `POST /auth/food-partner/register` with business details
2. Backend hashes password and creates partner in database
3. JWT token is generated and set as HTTP-only cookie
4. Partner is returned in response with token
5. For subsequent requests, include the token in cookies
6. Protected endpoints verify token via `FoodPartnerMiddlewares`

---

## Environment Variables

Required `.env` file in backend root:

```env
JWT_SECRET=your_super_secret_jwt_key_here
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/foodreels
NODE_ENV=development
PORT=3000
```

---

## Frontend Integration (Axios Examples)

### Register User
```javascript
const response = await axios.post('http://localhost:3000/api/auth/user/register', {
  fullname: { firstname: 'John', lastname: 'Doe' },
  email: 'john@example.com',
  password: 'securePassword123'
});
```

### Login User
```javascript
const response = await axios.post('http://localhost:3000/api/auth/user/login', {
  email: 'john@example.com',
  password: 'securePassword123'
}, { withCredentials: true });
```

### Fetch Foods (Protected)
```javascript
const response = await axios.get('http://localhost:3000/api/food', {
  withCredentials: true
});
```

### Like Food (Protected)
```javascript
const response = await axios.post('http://localhost:3000/api/food/like', {
  foodId: 'food-id-here'
}, { withCredentials: true });
```

### Save Food (Protected)
```javascript
const response = await axios.post('http://localhost:3000/api/food/save', {
  foodId: 'food-id-here'
}, { withCredentials: true });
```

---

## Models

### User Model
```javascript
{
  fullname: {
    firstname: String (required),
    lastname: String
  },
  email: String (required, unique),
  password: String,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Food Partner Model
```javascript
{
  businessname: String (required),
  contactname: String (required),
  phone: String (required),
  address: String (required),
  email: String (required, unique),
  password: String,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Food Model
```javascript
{
  name: String (required),
  description: String (required),
  video: String (required, URL),
  foodPartner: ObjectId (reference to Food Partner),
  likeCount: Number (default: 0),
  saveCount: Number (default: 0),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## Coming Soon
- Comments endpoint: `POST /api/food/comment`
- Search functionality
- User profile endpoints
- Partner analytics

---

## Support
For issues or questions, please check the frontend README or contact the development team.
