# **API-Overview**

This is an API for a sales platform web application, where anyone can create an user and list items for sale. These postings can be modified or deleted. Anyone can search for postings based on their creation date, category or location.

This API has the following endpoints:

# **/**
**GET** - The main page for the API

# **/registeruser**
**GET** - 
Used for creating a new user account. Username and password must be provided in the body. Additionally in this version of the API, a randomized user id must also be provided. 

Body requirements:
- id - string
- username - string
- password - string

# **/login**
**GET** - 
Used for logging an user in, providing access to posting, modifying and deleting postings.

Body requirements:
- username - string
- password - string

# **/logout**
**GET** - 
Logging the user out.

Body requirements:
- id - string

# **/postings**
**GET** - 
Getting postings created by all users. Can be queried with Time, Location and/or Category

Optional query parameters:
- time - string
- category - string
- location - string


**POST** -
Creating a new posting - login is required.

Body requirements (strings):
- id
- postingid
- title
- description
- category
- location
- images
- price
- dateofposting (UNIX stamp)
- deliverytype
- sellername
- sellerphone

# **/postings/:id**
**PUT** - 
Modifying an existing posting's title, description and price (LOGIN REQUIRED)

Body requirements (id = userid):
- id - string
- newTitle - string
- newDescription - string
- newPrice - string


**DELETE** - 
Deleting an existing posting (LOGIN REQUIRED)

Body requirements (id = userid):
- id - string
