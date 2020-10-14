const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')

app.use(bodyParser.json())

loggedInUsers = [];

let users = [
    {
      id: 1,
      username: "exampleuser",
      password: "examplepw"
    }
]

let postings = [
    {
        id: 1,
        sellerid: 1,
        title: "Example Item",
        description: "Example description",
        category: "Examples",
        location: "Helsinki",
        images: [
            "https://www.hopefullymadeupwebsite.com/images/463460325",
            "https://www.hopefullymadeupwebsite.com/images/463460326",
            "https://www.hopefullymadeupwebsite.com/images/463460327",
            "https://www.hopefullymadeupwebsite.com/images/463460328"
        ],
        price: "100.00",
        dateofposting: 1577836800,
        deliverytype: "shipping",
        sellername: "John Doe",
        sellerphone: "123-456-7890"
    }
]

app.get('/', (req, res) => {
    res.send('Myyntipalsta')
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})

// Creating a posting (LOGIN REQUIRED)
app.post('/postings', (req, res) => {
    // Checking if logged in
    if(loggedInUsers.includes(req.body.id)) {
        let deliverytype = req.body.deliverytype;
        if(deliverytype != "shipping" || deliverytype != "pickup") deliverytype = "shipping"; // Delivery type defaults to "shipping" if not specified as "pickup"
        const data = {
            id: req.body.postingid,
            sellerid: req.body.id,
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            location: req.body.location,
            price: req.body.price,
            images: [],
            dateofposting: Date.now(),
            deliverytype: deliverytype,
            sellername: req.body.sellername,
            sellerphone: req.body.sellerphone
        }
        // Adding up to 4 images
        // If more than 4 images, only first 4 are added
        for(var i = 0 ; i < (req.body.images.length > 4 ? 4 : req.body.images.length) ; i++)
        {
            data.images.push(req.body.images[i]);
        }
        postings.push(data);

        res.sendStatus(201);
    } else {
        res.sendStatus(401);
    }
    
})


// Getting postings based on time/category/location query
app.get('/postings', (req,res) => {
    let time = req.query.time;
    let category = req.query.category;
    let location = req.query.location;

    let result = [];

    if(time == null && category == null && location == null)
    {
        // If no valid search params, returning all postings
        res.json(postings);
    } else {
        for(var i = 0; i < postings.length; i++)
        {
            if((postings[i].dateofposting > time || time == null) && (postings[i].category == category || category == null) && (postings[i].location == location || location == null))
            {
                result.push(postings[i]);
            }
        }
        if(result.length <= 0) {
            // NO matches found
            res.sendStatus(204);
        } else {
            // Returning matches
            res.json(result);
        }
    }
})

// Modifying own posting (LOGIN REQUIRED, POSTING MUST BE OWN)
app.put('/postings/:id', (req, res) => { 
    // Checking if logged in
    if(loggedInUsers.includes(req.body.id)) {
        // Checking if posting exists
        const result1 = postings.find(t => t.id == req.params.id);
        if(result1 !== undefined) {
            // Checking if posting created by user
            if(result1.sellerid == req.body.id)
            {
                let index = postings.findIndex(t => t.id == req.params.id);
                postings[index].title = req.body.newTitle;
                postings[index].description = req.body.newDescription;
                postings[index].price = req.body.newPrice;
                res.sendStatus(200);
            }
        } else {
            // No such posting!
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(401);
    }
})

// Deleting own posting (LOGIN REQUIRED, POSTING MUST BE OWN)
app.delete('/postings/:id', (req, res) => { 
    let deleteSuccess = false;
    // Checking if loggged in
    if(loggedInUsers.includes(req.body.id)) {
        // Checking if posting exists
        const result1 = postings.find(t => t.id == req.params.id);
        if(result1 !== undefined) {
            // Checking if posting created by user
            if(result1.sellerid == req.body.id)
            {
                postings.splice(postings.findIndex(t => t.id == req.params.id))
                deleteSuccess = true;
                res.sendStatus(200);
            } else {
                // Not created by user => unauthorized!
                res.sendStatus(401);
            }
        } else {
            // No such posting!
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(401);
    }
})

// Creating an user account
app.post('/registeruser', (req, res) => { 
    let user = req.body.username;
    let pw =  req.body.password;
    if(user == null || pw == null)
    {
        res.sendStatus(400);
    } else {
        const data = {
            id: req.body.id,
            username: req.body.username,
            password: req.body.password,
          }
          users.push(data)
          res.sendStatus(201)
    }
}) 

// Logging in to an user account
app.get('/login', (req, res) => {
    let logInSuccess = false;
    let user = req.body.username;
    let pw =  req.body.password;

    // Searching for if user with that username exists...
    for(var i = 0; i < users.length; i++) {
        if(users[i].username == user)
        {
            // Found matching user!
            // Checking for correct password
            if(users[i].password == pw) {
                // Log-in info correct!
                // "Logging in" user
                loggedInUsers.push(users[i].id);
                logInSuccess = true;
            }
        }
    }
    if(logInSuccess){
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
})

// Logging out of an user account
app.get('/logout', (req, res) => {
    let index = loggedInUsers.indexOf(req.body.id);
    if(index != -1)
    {
        loggedInUsers.splice(index, 1);
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
})






  