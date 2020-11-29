// Add the destination file for the database
require('./models/db');

// Create a constant variable for the express server
const express = require('express');
let app = express();
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin",
        "*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

const controller = require('./controller/controller');
const userController = require('./controller/UserController');

controller(app);
userController(app);

// Create a listener for the port
app.listen(4000, () => {
    console.log('Now starting at port: 4000');
});