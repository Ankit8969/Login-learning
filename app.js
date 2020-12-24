
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const app = express()
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')

app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB" , {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})


console.log(process.env.API_KEY)

const userSchema = new mongoose.Schema({
    email : {
        type:String,
        unique:true
    },
    password:{
        type:String
    }
})


userSchema.plugin(encrypt , {secret:process.env.SECRET , encryptedFields : ['password']})
const User = new mongoose.model('User', userSchema)

app.get('/' , (req , res)=>{
    res.render('home')
})

app.get('/login' ,(req,res)=>{
    res.render('login')
})

app.get('/register' ,(req,res)=>{
    res.render('register')
})

app.post('/register' ,(req , res)=>{
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    })

    newUser.save((err)=>{
        if (err){
            console.log(err)
        }
        else{
            res.render('secrets')
        }
    })
})

app.post('/login', async (req,res)=>{
    const username = req.body.username
    const password = req.body.password

    await User.findOne({email:username} , (err , result)=>{
        if (err){
            console.log(err);
        }
        else{
            if (result){
                if (result.password === password)
                {
                    res.render('secrets')
                }
            }
        }
    })
})












app.listen(port, () => {
    console.log("Server running on port 3000");
});