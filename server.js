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

// const atlasConnection = 'mongodb+srv://admin:admin@recipes-mongodb.rafj8.mongodb.net/recipes?retryWrites=true&w=majority';
const localhost = 'mongodb://localhost:27017/recipes';

mongoose.connect(localhost, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

const userController = require('./controllers/users.controller.server');
const recipeController = require('./controllers/recipes.controller.server');
const metadataController = require('./controllers/recipes.controller.server');

userController(app);
recipeController(app);
metadataController(app);

// Create a listener for the port
app.listen(4000, () => {
    console.log('Now starting at port: 4000');
});
