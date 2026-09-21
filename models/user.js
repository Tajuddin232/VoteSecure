const mongoose = require('mongoose');

const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    age : {
        type : Number,
        required : true
    },
    email : {
        type : String,
    },
    mobile : {
        type : String,
    },
    address : {
        type : String,
        required : true,
    },
    aadharCardNumber : {
        type : Number,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    role : {
        type : String,
        enum : ['voter','admin']
    },
    isVoted : {
        type : Boolean,
        default : false 
    }
});

userSchema.pre("save",async function(){
    if(!this.isModified("password"))
    {
        return;
    }
    this.password = await bcrypt.hash(this.password,10);
});

userSchema.methods.comparePassword = function(password) {

    console.log("Password received by comparePassword:", password);
    console.log("Password stored in DB:", this.password);

    return bcrypt.compare(password, this.password);
}

const User = mongoose.model('User',userSchema);
module.exports = User;