import mongoose from "mongoose";
const OrModel = mongoose.Schema({
    IdUser:{
        type:String,
    },
    total:{
        type:String,
    },
    ArPro:{
        type:[Object],
    },
    creat:{
        type:Date,
        default:()=> new Date()
    }
})

export default mongoose.model('Or',OrModel)