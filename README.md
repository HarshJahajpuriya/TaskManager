# TaskManager

A simple MEAN stack task management app that lets users register, log in, and manage their tasks with ease—create, update, complete, or delete tasks. Features include a user-friendly interface, validations, and robust error handling for a smooth experience.

## Features:
1. Login and Registration: User can register and login, during registration user will select his/her ROLE, which will later provide them certain authorities. The role of the user will be extracted from the JWT token on the server through a middleware.
2. Authentication: JWT token based authentication has been implemented. On the server the a middleware will validate the token on the protected routes.
3. Routes:
    - '/', '/login', '/register', '/not-found: <b>Not protected</b>
    - '/dashboard': <b>Protected</b>
4. Role based Authorization:
    - Manager: Can access all the CRUD operations and can see all the tasks.
    - Team Lead: Can see all the tasks except MANAGER's, he/she can modify and assign tasks. <b>But cannot create Tasks</b>.
    - Employee: Can see and modify tasks assigned to them only, and then cannot assign task to any one else other then themselves. They <b>can create Tasks</b> but these tasks will also be assigned to them only.
5. Form Validation has been applied on each form, submit button will get enabled only when the form data is valid.
6. Created and Last updated time stamps for Tasks are being maintained on the dashboard.
7. Two references are being maintained for Task, one for the creator and the other for the user to which it is assigned.
8. Filter functionality has been implemented for status of Tasks.
9. Real-Time updates are being reflected because of the use of socket programming.



<hr/>

<span style="color:red;"><b>NOTE:</b></span>
This Repository contains both Front-end and Back-end application of the project.

<hr style="border: 2px solid gray"/>
<br/>

# Back-end

We are using Routes, Controller, Models, middlewares (for route guarding and user role extracting) and many such things to maintain the code quality, re-usability and manageability.

## Technologies used:
* express
* jsonwebtoken
* mongoose
* socket.io
* bcryptjs

## Database:
For database we are using MongoDB.<br>
The connection string for MongoDB connection is <b><i>mongodb://127.0.0.1:27017/TaskManager</i></b></br>
There are two collection in MongoDB:
1. User
2. Task

## How to run TaskManager Server?
1. Clone the respository in your local.
2. Setup MongoDB in your local. Create a new connection with the name TaskManager, on the above mentioned URI.
3. Run ```mongod``` command in terminal to start the mongoDB server.
    -   If you cannot find ```mongod``` command, you will have to navigate to the folder <i>[ C:\Program Files\MongoDB\Server\8.0\bin ]</i> where mongoDB is installed and then execute ```mongod``` command.
4. Run ```npm i``` in terminal in the backend folder, to install all the dependencies.
5. Run ```npm start``` in the terminal, your server will start running.


<br/>
<hr style="border: 2px solid gray"/>
<br/>

# Front-end

We are Angular 18 for our Front-end of TaskManager. Again we are using services, auth-guards, models, HttpClientService and many such things to achieve seamless UI/UX, along with real time data-sharing using socket programming.

## Technologies used:
* Angular
* rxjs
* jwt-decode
* socket.io-client

## How to run TaskManager Front-end?
1. Clone the repository in your local.
2. Make sure you have angular/cli installed on your machine, otherwise you will have to install it.
3. Run ```npm i``` in terminal in the backend folder, to install all the dependencies.
4. Run ```npm start``` or ```ng serve``` in the terminal, your application will start running.


