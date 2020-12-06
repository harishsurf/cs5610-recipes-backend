const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

mongoose.connect('mongodb://localhost:27017/recipes', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
});

const userController = require('./controllers/users.controller.server');

userController(app);

// Create a listener for the port
app.listen(4000, () => {
    console.log('Now starting at port: 4000');
});
