const mongoose = require('mongoose')
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    email : {
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

// generating the token for the client
userSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id:this._id.toString()} , process.env.SECRET)

        this.tokens = this.tokens.concat({token:token})
        await this.save()
        return token 
    }catch(error){
        res.status(501).send("ERROR " + error)
    }
}

// This function runs before saving our data in our database
userSchema.pre('save' , async function(next){
    
    if (this.isModified('password')){
        this.password =await bcrypt.hash(this.password,10)
    }

    next();
})


const User = new mongoose.model('User', userSchema)

module.exports = User ; 