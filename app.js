'use strict'
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const mainroute= require("./SRC/routes/main.routes")

//connect to db url
const dbUrl = 'mongodb+srv://sdiiigroup3:group3sd32023@cluster0.vjbvldr.mongodb.net/?retryWrites=true&w=majority';

mongoose.set('strictQuery', true);
mongoose.connect(dbUrl).then((result) => {
    app.listen(3000, () => {
        console.log('Connected to the server');
    });
    console.log('Connected to Database');
}).catch((err) => {
    console.log(err);
});



app.set('views', path.join(__dirname, './SRC/views'));
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, './SRC/public')))



app.use('/', mainroute)
app.use('/signup', mainroute)