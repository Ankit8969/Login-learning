
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const app = express()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}));

const User = require('./models/user')
const userRouter = require('./router/route')

app.use(express.json())
app.use(userRouter)

mongoose.connect("mongodb://localhost:27017/userDB" , {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})

// console.log(process.env.SECRET)

app.listen(port, () => {
    console.log("server is running on port 3000")
});
