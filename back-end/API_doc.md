# API document
## Users
### POST /api/users/register

#### Description: 
Register a new user

#### Request body:

- username: non-empty string, 3-15 characters length, allows a-z, A-Z, 0-9, ".", "-" and "_". E.g, "vAlid-User_Name" is valid, "User?Na/Me" and 'a' are invalid. Duplicate username is allowed

- email: check [this](https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript)

- password: 8-20 characters length, includes 1+ uppercase, 1+ lowercase, 1+ number. All symbols are allowed.

Example request body:
```
{
  "username": “test”,
  "email": “test@mail.utoronto.ca”,
  "password": “Passwd123”
}
```
#### Response:
- 201 Created
```
{
  "message": "User registered successfully",
  "id": number
}
```
- 400 Bad request: usually invalid form data
```
{
  "Error": "Invalid Input",
  "message": "Invalid user email"
}
```
```
{
  "Error": "Invalid Input",
  "message": "Invalid username"
}
```
```
{
  "Error": "Invalid Input",
  "message": "Invalid password"
}
```
- 409 Conflict
```
{
  "Error": "Invalid Input",
  "message": "User email already in use"
}
```
### POST /api/users/login
#### Description: 
Authenticate user with JWT. Will consider Auth0 if we still have time to implement later. 

Note: all review and comparison operations require JWT in the request's authentication header to work.

Once login, navigate to user profile page with user info in the reponse.

To logout, just clean the token in the frontend.

#### Request body:
- email
- password
#### Response:
- 200 OK
```
{
  "message": "Login successful",
  "token": string,
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john.doe@example.com",
    "num_likes": 10,
    "created_at": "2023-10-01T12:00:00Z"
  }
}
```
- 400 Bad request: 
```
{
  "error": "Invalid input",
  "details": "Email and password are required."
}
```
- 401 Unauthorized:
```
{
  "error": "Unauthorized",
  "details": "Invalid email or password."
}
```

## Cars
### GET /api/cars
#### Description:
Get a list of all cars options. 

Unlike paper management system in our assignment, we need to allow the user to select from all car models at the begining, so we don't actually need limit and offset. 

Check user behavior in https://www.cars.com/research/compare/ : select make -> select model -> select year.

Note: Each time only 10 cars are returned.
#### Response:
- 200 OK
```
{
  cars: [{car1}, {car2}...]
  offset: <offset>
}

```

```
- 401 Unauthorized: user didn't login
```
{
  "error": "Unauthorized, no token or invalid token"
}
```

### GET /api/cars/:id
#### Description:
Returns details of a specific car by id.

When making a comparison, just call this API multiple times with different id.

Note: reviews and comparisons are not returned
#### Response:
- 200 OK
```
{
  "id": "Int",
  "make": "String",
  "model": "String",
  "year": "Int",
  "generation": "String?",
  "engine_size_cc": "Float?",
  "fuel_type": "String?",
  "transmission": "String?",
  "drivetrain": "String?",
  "body_type": "String?",
  .... # check database schema
}
```
- 404 Not found:
```
{
  "error": "Car does not exist"
}
```
- 401 Unauthorized: user didn't login
```
{
  "error": "Unauthorized, no token or invalid token"
}
```

## Comparisons
### GET /api/comparisons
#### Description:
  Return a list of comparisons relates to the user

  Send API call with comparsion id to get details.

#### Query parameters:
- user_id: required, valid and unique.

/api/comparisons?user_id=1&user_id=2 is not acceptable. Will check token for proper user id. User 1 can't access User 2's saved comparisons.
#### Response body:
- 200 OK:
```
[{
  "id": int,
  "created_at": timestamp
}]
```
- 401 Unauthorized: 
```
{
  "error": "Unauthorized, no token or invalid token"
}
```
- 404 Not found: 
```
{
  "error": "User does not exist"
}
```
### GET /api/comparisons/:id
#### Description
Get a comparison's details. All cars info in the comparison will be included.
#### Response body:
- 200 OK
```
{
  "id": int,
  "user_id": int,
  "created_at": timestamp,
  "cars": [
    {
      "id": "Int",
      "make": "String",
      "model": "String",
      "year": "Int",
      "generation": "String?",
      "engine_size_cc": "Float?",
      "fuel_type": "String?",
      "transmission": "String?",
      "drivetrain": "String?",
      "body_type": "String?",
      ... # check database schema
    },
    ...
  ]
}
```
- 401 Unauthorized: 
```
{
  "error": "Unauthorized, no token or invalid token"
}
```
- 404 Not found: 
```
{
  "error": "Comparison does not exist"
}
```
### POST /api/comparisons
#### Request body:
Create a comparison. This is called only when user save/share a comparison.
{
  "user_id": int,
  "cars": [list of car ids only, no need to include details]
}
#### Response body:
- 201 Created
```
{
  "message": "Comparison created successfully",
  "id": number
}
```
- 400 Bad request
```
{
  "error": "Invalid Input",
  "message": "Invalid user id"
}
```
```
{
  "error": "Invalid Input",
  "message": "Invalid car id"
}
```
- 401 Unauthorized: 
```
{
  "error": "Unauthorized, no token or invalid token"
}
```
### DELETE /api/comparisons/:id
#### Description:
Deletes a comparison
#### Response:
- 204 No Content
```
No response body
```
- 400 Bad request
```
{
  "error": "Invalid Input",
  "message": "Invalid comparison id"
}
```
- 401 Unauthorized: 
```
{
  "error": "Unauthorized, no token or invalid token"
}
```
## Reviews
### GET /api/reviews
#### Description:
Get a page of reviews relates to the car

Each page includes 10 reviews by default and can't change
#### Query parameters:
- car_id: car id related to reviews. Can be multiple
- page: default 0
#### Response body:
List of reviews with full details.
- 200 OK
```
[
  {
    id: int,
    grade: int,
    content: string,
    car_id: int,
    user_id: int,
    created_at: timestamp
    num_likes: int
    num_dislikes: int
  }
]
```

### POST /api/reviews
#### Description:
Create a new review about a car. Server is supposed to know which user creates it and save into database.
#### Request body:
```
{
  car_id: int,
  grade: int,
  content: string
}
```
#### Response:
- 201 Created
```
{
  "message": "Review created successfully",
  "id": number
}
```
- 400 Bad request
```
{
  "error": "Invalid Input",
  "message": "Invalid car id"
}
```
- 401 Unauthorized: 
```
{
  "error": "Unauthorized, no token or invalid token"
}
```
### PUT /api/reviews/:id
#### Description:
Likes/Dislikes a review
#### Request body:
```
{"action": "like"}
```
```
{"action": "dislike"}
```
#### Response:
- 201 Updated
```
{         # updated review
    id: int,
    grade: int,
    content: string,
    car_id: int,
    user_id: int,
    created_at: timestamp
    num_likes: int
    num_dislikes: int
}

```
- 400 Bad request
```
{
  "error": "Invalid Input",
  "message": "Invalid review id"
}
```
- 401 Unauthorized: 
```
{
  "error": "Unauthorized, no token or invalid token"
}
```
### DELETE /api/reviews/:id
#### Description:
Deletes a review
#### Response:
- 204 No Content
```
No response body
```
- 400 Bad request
```
{
  "error": "Invalid Input",
  "message": "Invalid review id"
}
```
- 401 Unauthorized: 
```
{
  "error": "Unauthorized, no token or invalid token"
}
```