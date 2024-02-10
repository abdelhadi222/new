import mongoose from "mongoose";
const ProModel = mongoose.Schema({
    titel:{
        type:String,
    },
    des:{
        type:String,
    },
    price:{
        type:String,
    },
    Images:{
        type:[String]
    },
    creat:{
        type:Date,
        default:()=> new Date()
    }
})

export default mongoose.model('Pro',ProModel)