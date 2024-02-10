import mongoose from "mongoose";
const UserModel = mongoose.Schema({
   name:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    Carte:{
        type:[Object],
        default:[]
    },
    token:{
       type:String
    },
    creat:{
        type:Date,
        default:()=> new Date()
    }
})

export default mongoose.model('User',UserModel)