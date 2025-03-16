
## Project Proposal: Car Model Comparison Platform

### Team members:

Liu Linhao  [linhao.liu@mail.utoronto.ca](mailto:linhao.liu@mail.utoronto.ca) 1003242573  
Chen Hao Gao [chenhao.gao@mail.utoronto.ca](mailto:chenhao.gao@mail.utoronto.ca) 1005239877  
jiawei Chen  
[jasonjiawei.chen@mail.utoronto.ca](mailto:jasonjiawei.chen@mail.utoronto.ca)  
1005983018

### Motivation

#### Problem and needs

A car is crucial and necessary in North America, however car buyers often hesitate to choose between numerous car models. One major reason is that consumers often fail to handle overwhelming amounts of information from car trade websites, manufacturers and sellers. Besides, it’s hard for them to verify the correctness of this information, most of which come from people who try to make more profit instead of selling the correct car.

#### Why worth pursuing

A third-party, non-profit car model comparison platform can help users make better purchasing decisions by providing clear and correct information. This project does address a real issue, and can potentially attract a significant user base.

#### Target user

First-time car buyers, car enthusiasts, car dealers, car youtubers, those who look for cars for alternative purposes, and those who want to upgrade their existing vehicle.

#### Existing solutions and their limitations

We do find some existing websites that satisfy our goal. E.g, [car trader](https://www.autotrader.ca/research/comparison), [edmunds](https://www.edmunds.com/car-comparisons) and [cars](https://www.cars.com/research/compare/). There are several limitations we can think of.

1. They come from car sellers.  
2. Many cars have missing data  
3. No customer review or only a few customer reviews, which makes it hard to evaluate the real driver experience.  
4. Crowded with ads  
5. Lack of customization

### Objective and Key features

#### Project objectives

Develop a user-friendly car model comparison platform that allows users to easily compare different car models based on various criteria. The platform should include detailed, up-to-date information on cars, and provide smooth and intuitive user experience. To be more specific:

1. The user can register and login to the platform. The account allows the user to save previous comparisons and share a comparison with others by sending the url.  
2. The user can write a review and grade a car model. For each car model, the user can also see an overall grade and reviews from other users.  
3. The user can choose arbitrary multiple (at most four) cars to compare at the same time.  
4. Maybe? A bulletin board for discussion. Bulletin boards can let brand lovers discuss and share opinions on diverse topics such as car modification and resell parts.

#### Core features

##### **Technical approach**: Express.js backend

**Database Schema and relationships**

```
model Car {

id Int @id @default(autoincrement())

make String

model String

year Int

generation String?

engine_size_cc Float?

fuel_type String?

transmission String?

drivetrain String?

body_type String?

num_doors Int?

country String?

mpg_city Float?

mpg_highway Float?

horsepower_hp Int?

torque_ftlb Int?

acceleration Float?

car_image_path String?

comparisons Comparison[] @relation(“CarToComparison”)

reviews Review[] @relation(“CarToReview”)

}

  
  

model User {

id Int @id @default(autoincrement())

username String @unique

email String @unique

password_hash String

num_likes Int @default(0)

comparisons Comparison[] @relation(“UserToComparison”)

reviews Review[] @relation(“UserToReview”)

}

  
  

model Review {

id Int @id @default(autoincrement())

grade Int @check(grade >= 0 && grade <= 5)

content String

car_id Int

car Car @relation(fields: [car_id], references: [id])

user_id Int

user User @relation(fields: [user_id], references: [id])

created_at DateTime @default(now())

num_likes Int @default(0)

dislikes Int @default(0)

}

  
  

model Comparison {

id Int @id @default(autoincrement())

user_id Int

user User @relation(fields: [user_id], references: [id])

cars Car[] @relation(“ComparisonToCar”)

created_at DateTime @default(now())

}
```

Note: car data will be fetched from [kaggle](https://www.kaggle.com/datasets/jahaidulislam/car-specification-dataset-1945-2020/data). 

**File storage requirements**: car images. (optional) car 3d models

**User experience and interface design**: should be similar with [cars](https://www.cars.com/research/compare/), but cleaner and simpler.

**API integration with external services**: we don’t need this for now, but for further implementation, we can use external API service to fetch car data to guarantee the real-time data (need extra cost). Besides, as an advanced feature we can allow users to use google/social media authentication to automatically create an account on the platform.

#### Fulfillment of course requirements 

1. We use tech stacks that satisfy the core technical requirements.  
2. This project requires front-end design, API interpretation, file storage and database management, which cover major topics we learned from this course.

#### Project scope and feasibility 

We believe the project is feasible within a 1-2-month timeline. Please check the tentative plan to see how we manage to complete the project.

### Tentative Plan

* **Frontend Development (React)**:  
  * Team Member A: Responsible for implementing the user interface, ensuring responsiveness, and integrating with the backend.  
* **Backend Development (Express.js)**:  
  * Team Member B: Responsible for setting up the server and API endpoints  
* **Database Management and Integration**:  
  * Team Member C: Responsible for designing the database schema, setting up PostgreSQL, and manage all database operations

**Timeline**

**Week 1: Project setup and planning**

#### Team Member A (Frontend):

* Research and finalize UI/UX design (clean and simple, inspired by existing platforms like cars.com).  
* Create wireframes and mockups for the platform (homepage, comparison page, car details page, user profile page).  
* Set up the frontend project structure using React.

#### Team Member B (Backend):

* Set up the Express.js backend project.  
* Define API endpoints for user authentication, car data retrieval, and comparison functionality.  
* Implement basic user authentication (register/login).

#### Team Member C (Database):

* Design and finalize the database schema (Cars, Users, Reviews, Comparisons).  
* Set up PostgreSQL and create tables with relationships.

**Week 2: Core feature development** 

#### Team Member A (Frontend):

* Develop the homepage to create a car model selection.  
* Create the car comparison page (displaying up to four cars in a table format).  
* Implement the car details page (showing specifications, images, and reviews).

#### Team Member B (Backend):

* Develop API endpoints for fetching car data and comparisons.  
* Implement review functionality (users can write and submit reviews).  
* Add logic to calculate and display overall grades for car models.

#### Team Member C (Database):

* Manage queries to load cars and reviews.  
* Implement relationships between tables (e.g., linking reviews to cars and users).  
* Set up file storage for car images (using AWS S3 or a similar service).

**Week 3: Advanced features**

#### Team Member A (Frontend):

* Implement user profile page (display saved comparisons and reviews).  
* Add functionality to share comparisons via URL.  
* Ensure the platform is responsive and works seamlessly on various devices.

#### Team Member B (Backend):

* Develop API endpoints for saving and retrieving user comparisons.  
* Add logic to generate unique URLs for shared comparisons.

#### Team Member C (Database):

* Implement queries for user register and login.  
* Allow users to load comparisons.  
* Import initial car data from Kaggle into the database.

**Week 4: Testing, Debugging and Deployment**

#### Team Member A (Frontend):

* Front-end unit test  
* Browser compatibility  
* Scale compatibility   
* Device compatibility

#### Team Member B (Backend):

* Backend unit testing  
* Server deployment

#### Team Member C (Database):

* Production database deployment