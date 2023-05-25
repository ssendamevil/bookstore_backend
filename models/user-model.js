const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    email:{type:String, unique:true, required:true},
    password:{type:String, required:true},
    name: {type: String, required:true},
    surname: {type: String, required: true},
    isActivated:{type:Boolean, default:false, required: true},
    activationLink:{type:String, required:true}
})

module.exports = model('User',UserSchema)