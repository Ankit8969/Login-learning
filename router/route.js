const express = require('express')
const User = require('../models/user')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.get('/' , (req , res)=>{
    res.render('home')
})

app.get('/login' ,(req,res)=>{
    res.render('login')
})

app.get('/register' ,(req,res)=>{
    res.render('register')
})


app.post('/register' ,async (req , res)=>{
    try{
        const user = new User({
            email:req.body.username,
            password:req.body.password
        })

        // before saving the data we have to bcrypt our password for security purpose

        const token =await user.generateAuthToken()

        user.save().then((result)=>{
            res.render('secrets')
        }).catch((error)=>{
            res.status(500).send(error)
        })
    }
    catch(error){
        res.status(500).send("Invalid Register")
    }
})

app.post('/login', async (req,res)=>{
    try{
        // console.log(req.body)
        const email = req.body.username
        const password = req.body.password
        
        const findUser = await User.findOne({email})

        const isMatch =await bcrypt.compare(password , findUser.password)
        const token =await findUser.generateAuthToken()
        console.log(token)
        if (isMatch)
        {
            res.render('secrets')
        }
        else
        {
            console.log("Some went wrong")
            res.redirect('/login')
        }
    }catch(error){
        res.status(500).send("Invalid " + error)
    }
})



// const createToken = async ()=>{
//     const token = await jwt.sign({id:"5fe74664d7b3244d74ece09f"} , "AmITheoriginaluser!", {expiresIn:"5 seconds"})

//     console.log(token)

//     const userVerify = await jwt.verify(token ,"AmITheoriginaluser!")

//     console.log(userVerify)
// }

// createToken();









module.exports = app;