// import express from "express"
// import ProModel from "../Model/Pro"
// import UserModel  from "../Model/User"
// import multer from "multer"
// const Router = express.Router()

// const storage = multer.diskStorage({
//     destination:(req,file,cb,next)=>{
//         console.log('one');
//         cb(null,'./Image');
//     },
//     filename:(req,file,cb)=>{

//          const finame =   `${Date.now()}_${file.originalname.replace(/\s+/g,'-')}`;
//         cb(null,finame)

//     }
// })

// const upload = multer({storage:storage})

// // add User = > 
// Router.post('/sing', async (req,res)=>{
//     console.log('rr');
//   try {
//      let user = await UserModel.create({
//     name:req.body.name,
//     email:req.body.email,
//     password:req.body.password
//    })

//    if(!user){
//      res.json({message:'User Is Not Creat'})
//    }
//    res.redirect('/')
//   } catch (err) {
//       console.log(err);
//   } 
// })





