# 🎉 Auction Flateform-

Welcome to the Auction Flatform System! This MERN application is designed to manage auctions, bids, and users.

It features:
- Backend: Built with Node.js and Express.
- Frontend: Developed using React with Vite for the build tool.
- Styling: Styled with Tailwind CSS.
- Database: Uses MongoDB for data storage.
- Authentication: Managed with JWT (JSON Web Tokens).
- Password Security: Handled with bcrypt for hashing passwords.

# Backend (backend/)

- config/: Contains configuration files such as db.js for setting up the database connection.
- controllers/: Implements business logic for different aspects of the application:
auctionController.js: Handles auction-related operations.
bidController.js: Manages bid-related logic.
userController.js: Manages user-related logic.
- middleware/: Includes middleware functions like authMiddleware.js for authentication and authorization.
- models/: Defines data models using Mongoose:
AuctionItem.js: Schema for auction items.
Bid.js: Schema for bids.
User.js: Schema for users.
- routes/: Defines API routes:
auctionRoutes.js: Routes for auction-related API endpoints.
bidRoutes.js: Routes for bid-related API endpoints.
userRoutes.js: Routes for user-related API endpoints.
server.js: Entry point for starting the backend server and connecting to the database.

# 🚀 Getting Started

# Installation

- Backend 

1.Navigate to the backend directory:

`cd backend`

2.Install dependencies:

`npm install`

3.Set up environment variables:

- Create a .env file in the backend directory with the following content:

`PORT=5000
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret`

ORIGIN=http://localhost:5173 or url of frontend 

# 🏃‍♂️ Running the Project

Start the backend server:

`npm run dev`

The backend will run on http://localhost:5000.


# 🚀 Auction System API Documentation

## 📌 Base URL

`https://localhost:5000`

## 🔐 Authentication

Most endpoints require authentication using JWT tokens. Include the token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

## 📋 Endpoints

### 👤 User Management

#### 📝 Register User

```http
POST /api/users/register
```

Register a new user.

**Request Body:**

```json
{
	"username": "string",
	"email": "string",
	"password": "string",
	"confirmPassword": "string"
}
```

**Responses:**

-   `201 Created`: User successfully registered
    ```json
    {
    	"id": "string",
    	"username": "string",
    	"email": "string"
    }
    ```
-   `400 Bad Request`: Missing fields or user already exists
-   `500 Internal Server Error`: Server error

#### 🔑 Login User

```http
POST /api/users/login
```

Authenticate a user and receive a JWT token.

**Request Body:**

```json
{
	"email": "string",
	"password": "string"
}
```

**Responses:**

-   `200 OK`: Successfully authenticated
    ```json
    {
    	"id": "string",
    	"username": "string",
    	"email": "string"
    }
    ```
-   `400 Bad Request`: Missing fields or invalid credentials
-   `500 Internal Server Error`: Server error

#### 👀 Get User Profile

```http
POST /api/users/profile
```

Retrieve the authenticated user's profile.

**Responses:**

-   `200 OK`: Profile retrieved successfully
    ```json
    {
    	"id": "string",
    	"username": "string",
    	"email": "string"
    }
    ```
-   `401 Unauthorized`: Invalid token
-   `404 Not Found`: User not found
-   `500 Internal Server Error`: Server error

#### 🚪 Logout User

```http
POST /api/users/logout
```

Log out the current user.

**Responses:**

-   `200 OK`: Logged out successfully
    ```json
    {
    	"message": "Logged out successfully"
    }
    ```
-   `500 Internal Server Error`: Server error

### 🏷️ Auction Management

#### 🆕 Create Auction Item

```http
POST /api/auctions
```

Create a new auction item.

**Request Body:**

```json
{
	"title": "string",
	"description": "string",
	"startingBid": "number",
	"endDate": "string (ISO 8601 format)"
}
```

**Responses:**

-   `201 Created`: Auction item created successfully
-   `500 Internal Server Error`: Server error

#### 📜 Get All Auction Items

```http
GET /api/auctions
```

Retrieve all auction items.

**Responses:**

-   `200 OK`: List of auction items retrieved successfully
-   `500 Internal Server Error`: Server error

#### 🔍 Get Auction Item by ID

```http
GET /api/auctions/:id
```

Retrieve a specific auction item by its ID.

**Responses:**

-   `200 OK`: Auction item retrieved successfully
-   `404 Not Found`: Auction item not found
-   `500 Internal Server Error`: Server error

#### 🔄 Update Auction Item

```http
PUT /api/auctions/:id
```

Update an existing auction item.

**Request Body:**

```json
{
	"title": "string",
	"description": "string",
	"startingBid": "number",
	"endDate": "string (ISO 8601 format)"
}
```

**Responses:**

-   `200 OK`: Auction item updated successfully
-   `403 Forbidden`: Unauthorized action
-   `404 Not Found`: Auction item not found
-   `500 Internal Server Error`: Server error

#### 🗑️ Delete Auction Item

```http
DELETE /api/auctions/:id
```

Delete an auction item.

**Responses:**

-   `200 OK`: Auction item removed successfully
-   `403 Forbidden`: Unauthorized action
-   `404 Not Found`: Auction item not found
-   `500 Internal Server Error`: Server error

#### 📊 Get User's Auction Items

```http
POST /api/auctions/user
```

Retrieve auction items created by the authenticated user.

**Responses:**

-   `200 OK`: User's auction items retrieved successfully
-   `500 Internal Server Error`: Server error

#### 🏆 Get Auction Winner

```http
GET /api/auctions/winner/:id
```

Retrieve the winner of a completed auction.

**Responses:**

-   `200 OK`: Winner retrieved successfully
-   `400 Bad Request`: Auction has not ended yet
-   `404 Not Found`: Auction item not found or winner not found
-   `500 Internal Server Error`: Server error

#### 🎉 Get User's Won Auctions

```http
POST /api/auctions/won
```

Retrieve auctions won by the authenticated user.

**Responses:**

-   `200 OK`: Won auctions retrieved successfully
-   `500 Internal Server Error`: Server error

### 💰 Bid Management

#### 🤑 Place Bid

```http
POST /api/bids
```

Place a bid on an auction item.

**Request Body:**

```json
{
	"auctionItemId": "string",
	"bidAmount": "number"
}
```

**Responses:**

-   `200 OK`: Bid updated successfully (if user already had a bid)
-   `201 Created`: New bid placed successfully
-   `400 Bad Request`: Invalid bid details or new bid not higher than current bid
-   `404 Not Found`: Auction item not found
-   `500 Internal Server Error`: Server error

#### 📜 Get Bid History

```http
GET /api/bids/:auctionItemId
```

Retrieve the bid history for a specific auction item.

**Responses:**

-   `200 OK`: Bid history retrieved successfully
-   `400 Bad Request`: Auction item ID is required
-   `500 Internal Server Error`: Server error

#### 📊 Get User's Bids

```http
POST /api/bids/user
```

Retrieve bids placed by the authenticated user.

**Responses:**

-   `200 OK`: User's bids retrieved successfully
-   `500 Internal Server Error`: Server error

## 📝 Models

### User

-   `id`: string
-   `username`: string
-   `email`: string
-   `password`: string (hashed)
-   `createdAt`: date

### AuctionItem

-   `id`: string
-   `title`: string
-   `description`: string
-   `startingBid`: number
-   `endDate`: date
-   `createdBy`: User reference
-   `createdAt`: date
-   `updatedAt`: date

### Bid

-   `id`: string
-   `auctionItemId`: AuctionItem reference
-   `userId`: User reference
-   `bidAmount`: number
-   `createdAt`: date

## ⚠️ Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests. Here's a comprehensive list of status codes used in this API:

-   `200 OK`: The request was successful
-   `201 Created`: A new resource was successfully created
-   `400 Bad Request`: The request was invalid or cannot be served. This includes:
    -   Invalid input
    -   Missing required fields
    -   User already exists (during registration)
    -   Invalid credentials (during login)
    -   Auction has not ended yet (when getting winner)
    -   Invalid bid details
    -   New bid not higher than current bid
-   `401 Unauthorized`: Authentication failed or user doesn't have permissions for the requested operation
-   `403 Forbidden`: The request is understood, but it has been refused or access is not allowed
-   `404 Not Found`: The requested resource could not be found. This includes:
    -   User not found
    -   Auction item not found
    -   Winner not found
-   `500 Internal Server Error`: The server encountered an unexpected condition that prevented it from fulfilling the request

Error responses will include a JSON object with a `message` field describing the error.

## 🔒 Security

-   JWT tokens are used for authentication
-   Passwords are hashed using bcrypt before storage
-   CORS is configured to restrict access to specified origins
-   HTTP-only cookies are used for storing JWT tokens
-   Secure flag is set on cookies for HTTPS environments
-   Same-site cookie attribute is set to 'none' for cross-site requests

## 🔄 CORS Configuration

CORS is configured with the following options:

-   Origin: Restricted to the value specified in the `ORIGIN` environment variable
-   Methods: GET, PUT, POST, DELETE
-   Credentials: true (allows cookies to be sent with cross-origin requests)

## 🌐 Environment Variables

The following environment variables are used:

-   `PORT`: The port on which the server runs (default: 5000)
-   `MONGODB_URI`: The connection string for MongoDB
-   `JWT_SECRET`: The secret key used for JWT token generation and verification
-   `ORIGIN`: The allowed origin for CORS

## 📚 Dependencies

-   express: Web application framework
-   mongoose: MongoDB object modeling tool
-   bcryptjs: Library for hashing passwords
-   jsonwebtoken: JSON Web Token implementation
-   dotenv: Loads environment variables from a .env file
-   cors: Middleware to enable CORS...