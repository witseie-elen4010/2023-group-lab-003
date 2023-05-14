'use strict'
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const route = require('./SRC/Routes/Models/routes')

// connect to db url
const dbUrl = 'mongodb+srv://sdiiigroup3:group3sd32023@cluster0.vjbvldr.mongodb.net/?retryWrites=true&w=majority'

mongoose.set('strictQuery', true)
mongoose.connect(dbUrl).then((result) => {
  app.listen(3000, () => {
    console.log('Connected to the server')
  })
  console.log('Connected to Database')
}).catch((err) => {
  console.log(err)
})

app.set('views', path.join(__dirname, './SRC/Views'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, './SRC/Public')))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', route)
app.use('/scheduleAppointment', route)
