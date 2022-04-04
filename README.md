# Ayan Tuladhar
# CSC3916_HW3
# 03/13/2022

Please use the link below to use React App for login


https://hwtest-1.herokuapp.com/#/signin



[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/ee6b372e5db0b05e329b?action=collection%2Fimport)


Assignment Three 
  
The purpose of this assignment is to get comfortable working with a NoSQL database (MongoDB).  
For  this  assignment  you  will  create  a  Users  collection  to  store  users  for  your
signup  and  signin methods. You will pass Username, Name and Password as part of signup.  To get a token you will 
call SingIn with username and password only.
The token should include the Name and UserName (not password) 
You  will  also  create  Movies  collection  to  store  information  about  movies.    All  endpoints  will  be 
protected with the JWT token received by a signin call.  


Requirements 
Create a collection in MongoDB to hold information about movies 

• Each entry should contain the following 

o Title 

o Year released 

o Genre  (Action,  Adventure,  Comedy,  Drama,  Fantasy,  Horror,  Mystery,  Thriller, 
Western) 

o Array of three actors that were in the film 

§ ActorName 


§ CharacterName 

o The movie collection should have at least five movies 

• Create a NodeJS Web API to interact with your database 

o Follow best practices (e.g. /movies collection) 

o Your API should support all CRUD operations (through HTTP POST, PUT, DELETE, GET) 

o Ensure incoming entities contain the necessary information.  For example if the movie 
does  not  contain  actors,  the  entity  should  not  be  created  and  an  error  should  be 
returned  

• All endpoints should be protected with a JWT token (implement signup, and signin) 

o For this assignment you must implement a User database in Mongo 

§ Password should be hashed  

§ Name 

§ Username  

o If username exists the endpoint should return an error that the user already exists 

o JWT secret needs to be stored in an environment variable 

• Update  the  Pre-React  CSC3916_HW5  placeholder  project  to  support  /signup  and  /signin 
methods.  The React Single Page App should use your Assignment 3 API to support those two 
operations. 

Acceptance Criteria 

• API Deployed to Heroku and Database deployed to Atlas 

• React Website that allows user to signup and singin (we did this in class) 

• PostMan test collection that  

o Signs Up a user (create a random user name and random password in your pre-test) 

o SignIn a User – parse token and store in postman environment variable 

o A separate call for each endpoint (save a movie, update a movie, delete a movie and 
get a movie) 

o Test error conditions (user already exists) 

§ SignUp (user already exist) 

§ Save  Movie  (missing  information  like  actors  (must  be  at  least  three),  title, 
year or Genre) 

Resources 

• https://www.mongodb.com/cloud/atlas 

• Create a Free Subscription *Amazon 
