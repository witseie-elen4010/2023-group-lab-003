'use strict'
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const path = require("path");
const session = require('express-session');
const mainroute= require("./SRC/routes/main.routes")
const flash = require("express-flash");

//connect to db url
const dbUrl = 'mongodb+srv://sdiiigroup3:group3sd32023@cluster0.vjbvldr.mongodb.net/?retryWrites=true&w=majority';

mongoose.set('strictQuery', true);
mongoose.connect(dbUrl).then((result) => {
    const port = process.env.PORT || 3000
    app.listen(port, () => {
        console.log('Connected to the server');
    });
    console.log('Connected to Database');
}).catch((err) => {
    console.log(err);
});


app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, './SRC/views'));

app.use(express.static(path.join(__dirname, './SRC/public')))

app.use(express.json()); //use json to fetch data from user
app.set('view engine', 'ejs') //view engine is ejs

//Express session middleware
app.use(session({
    secret: 'VerySecretValue',
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge: 60 * 60 * 60, //session experiration time in milliseconds
    },
}));

//Express-flash middleware.
app.use(flash());






app.use(mainroute)


