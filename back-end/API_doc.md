# API document
## Users
### POST /api/users/register

#### Description: 
Register a new user

#### Request body:

- username: non-empty string, 3-15 characters length, allows a-z, A-Z, 0-9, ".", "-" and "_". E.g, "vAlid-User_Name" is valid, "User?Na/Me" and 'a' are invalid. Duplicate username is not allowed

- email: use a simpler regex to validate: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/

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
    "id": 5,
    "username": "P3111",
    "email": "test@gmail3.com",
    "num_likes": 0
}
```
- 400 Bad request: usually invalid form data
```
{
  "errors": [
    "Invalid email"
  ]
}
```
```
{
  "errors": [
    "Invalid password"
  ]
}
```
```
{
  "errors": [
    "Invalid username"
  ]
}
```
- 409 Conflict
```
{
  "Error": "Invalid Input",
  "message": "Email is already registered"
}
```
```
{
  "Error": "Invalid Input",
  "message": "Username is already registered"
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
  "token": string,
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john.doe@example.com",
    "num_likes": 10,
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
    "error": "Invalid email or password"
}
```
### GET /api/users
#### Description:
Get the profile of the current user. User id is fetched from JWT in the header, so no additional parameters/body are required.

#### Response
- 200 OK
```
{
    "id": 3,
    "username": "P311121",
    "email": "test@gmail2.com",
    "password_hash": "$2b$10$GVPT8Vf2wlS1.UX8qD.yw.pFA4QIbER2kRiTxqZ/jLMiYYQE.b8yu",
    "num_likes": 0
}
```
- 401 UNauthorized
```
{
  "error": "Unauthorized"
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
  page: 1,
  limit: 10
}

```

- 401 Unauthorized: user didn't login
```
{
  "error": "Unauthorized"
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
  "error": "Unauthorized"
}
```

## Comparisons
### GET /api/comparisons
#### Description:
  Return a list of comparisons relates to the current user.

  Send API call with comparsion id to get details.

  Usually we don't have too much comparisons so paging is not implemented.

#### Response body:
- 200 OK:
```
[{
  "id": int,
  "user_id": int,
  "created_at": timestamp,
  "cars": [{car1}, {car2}...],
}]
```
- 401 Unauthorized: 
```
{
  "error": "Unauthorized"
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
  "error": "Unauthorized"
}
```
- 404 Not found: 
```
{
  "error": "Comparison does not exist"
}
```
- 403 Forbidden: If the user_id is not the current user.
```
{
  "error": "You do not own this comparison"
}
```
### POST /api/comparisons
#### Request body:
Create a comparison. This is called only when user save/share a comparison.
{
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
  "message": "Invalid car id: <id>"
}
```
- 401 Unauthorized: 
```
{
  "error": "Unauthorized"
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
  "error": "Unauthorized"
}
```
## Reviews
### GET /api/reviews/by-car
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
- 401 Unauthorized
```
{
  "error": "Unauthorized"
}
```

## Reviews
### GET /api/reviews/by-user
#### Description:
Get a page of reviews relates to the current user
#### Query parameters:
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
#### Response
- 401 Unauthorized
```
{
  "error": "Unauthorized"
}
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
  "error": "Unauthorized"
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
{    # updated review
    id: int,
    grade: int,
    content: string,
    car_id: int,
    user_id: int,
    created_at: timestamp
    num_likes: int
    dislikes: int
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
  "error": "Unauthorized"
}
```
- 404 Not found:
```
{
  "error": "Review does not exist"
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
  "error": "Unauthorized"
}
```
