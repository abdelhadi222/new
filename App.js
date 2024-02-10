import express from "express"
import path from "path"
import mongoose from "mongoose"
import multer from "multer"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import ProModel from "./Model/Pro.js"
import UserModel  from "./Model/User.js"
import session, { Cookie } from "express-session"
import { log } from "console"
import { render } from "ejs"
import OrModel from "./Model/Or.js"
let message = ""
let token = []
let t = 'ueyfedlj233434cdkcjk76JE554FKH76FFF847T5OJjHDKF6565EFHEU_è-rurfrlrhffçr_fifiryfef_èfrfkdjfddfufhdfuryirurygirjfrifyrzur_zrtrytzruhzrgjfhjhgjfhgyteuuziyuzryizytuzyrtyzryt_tr_ç'



function tokeWork() {
    for (let i = 0; i < t.length; i++) {
       let rand = Math.floor(Math.random() * t.length)
       token.push(t[rand])
    }
}


const app = express()
mongoose.connect('mongodb://localhost/shopexpress' , {useUnifiedTopology:true,useNewUrlParser:true})
const DB = mongoose.connection

DB.on('error' , (error)=> {console.log(error)})
DB.once('open' , ()=>{console.log('DATA BASE IS CONNECED')})

app.set("view engine","ejs")
app.use(express.static('public'));
// app.use(express.static('/Image'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(session({
    secret:'secret key',
    saveUninitialized:true,
    resave:false
}))

app.use((req,res,next)=>{
     res.locals.message == req.session.message;
     delete req.session.message;
     next()
});


const storage = multer.diskStorage({
    destination:(req,file,cb,next)=>{
        console.log('one');
        cb(null,'./public/Image');
    },
    filename:(req,file,cb)=>{

         const finame =   `${Date.now()}_${file.originalname.replace(/\s+/g,'-')}`;
        cb(null,finame)

    }
})

const upload = multer({storage:storage})





app.get('/' ,async (req,res)=>{
    let y = req.cookies.token
    let getP = await ProModel.find()
    res.render('index', {titel:'pag Home', test:!y?true:false,allPro:getP})
})

app.get('/AddPro' , (req,res)=>{
        let y = req.cookies.token
    res.render('AddPro', {titel:'Add Pro',message:'', test:!y?true:false})
})

app.get('/MyOrder' ,async (req,res)=>{
        let y = req.cookies.token
        let grt = await OrModel.find()
    res.render('MyOrder',  {titel:'My Order', test:!y?true:false, allOr:grt})
})

app.get('/login' , (req,res)=>{
        let y = req.cookies.token
    res.render('login', {titel:'login Page' , message:""})
})
app.get('/Sing' , (req,res)=>{
    
    res.render('Sing'  , {titel:'Register Page'})
})
// app.get('/Carte' , (req,res)=>{
//     res.render('Carte'  , {titel:'Carte User'})
// })

app.get('/AddToCarte/:id' , async (req,res)=>{
   let id = req.params.id
   console.log('IS ' , id);
   let y = req.cookies.token

   if(!y){
     res.redirect('/login')
   }

   try {
     let get = await ProModel.findOne({_id:id})
   let User = await UserModel.findOne({token:y})
   let {Carte} = User
   let ch =  Carte.some((e)=> e.idP == id )
//    let fi =  Carte.filter((e)=> e.idP == id )
   let ind =  Carte.findIndex((e)=> e.idP == id )
   if(ch){
    let ar = {idP:id,qu:1 + Carte[ind].qu ,titel:get.titel,image:get.Images[0],price:get.price}
    Carte.splice(ind,1)
    await User.updateOne({Carte:[...Carte,ar]})
    
      
     return res.redirect("/")
   }
   let Ar = {idP:id,qu:1,titel:get.titel,image:get.Images[0], price:get.price} 
   await User.updateOne({Carte:[...Carte,Ar]})
    return res.redirect("/")
    
   } catch (err) {
     console.log(err);
   }

})

app.get('/Carte' , async (req,res)=>{
    let to = req.cookies.token
    let user = await UserModel.findOne({token:to})
    const {Carte} = user
    res.render('Carte' , {titel:'Carte User',AllCarte:Carte, test:!to?true:false})

    
})




// add User = > 
app.post('/sing', async (req,res)=>{
    console.log('rr', req.body);
    tokeWork()
  try {
     let user = await UserModel.create({
    name:req.body.name,
    email:req.body.email,
    password:req.body.password,
    token:token.join('')
   })
  

   if(!user){
     res.json({message:'User Is Not Creat'})
   }

//    req.session.message = {
//      type : "success",
//      message : "User Adding"
//    }
   res.cookie('token', token.join(''));
   res.redirect('/')

  } catch (err) {
      console.log(err);
  } 
})


// Login => 
app.post('/login' , async (req,res)=>{
    console.log('e', req.body)
    try {
         const get = await UserModel.findOne({email:req.body.email})
         console.log('get' , get);
         const {token} = get
         if(!get) {
              req.session.message = {
                 type : "failde",
                 message : "You not A Account"
               }    
               let message =  'you hava not account'
            res.render('login', { titel:'login Page' , message:message})    
          
         }

         if(req.body.password == get.password){
            res.cookie('token', token);
            res.redirect('/')
         }
         else{
             req.session.message = {
              type : "failde",
              message : "Your Password Is Wong"
            }
            res.render('login', {titel:'login Page' , message:'Your Password Is Wong'}) 
         }

    } catch (err) {
        console.log(err)
    }
})


// Add PRO => 
app.post('/AddPro', upload.array('Image', 10) , async (req,res)=>{

 try {
       console.log('Body ' , req.files);
       let Ar =[]
       for (let i = 0; i < req.files.length; i++) {
          Ar.push(`${req.files[i].filename}`)
       }
    const pro = await ProModel.create({
        titel:req.body.titel,
        des:req.body.des,
        price:req.body.price,
        Images:Ar
    })
    if(!pro){
        res.render('AddPro' , {titel:'Add Pro', message:'Pro Adding'})
    }
    res.redirect('/')
 } catch (err) {
    console.log(err);
 }
})

// ad To cARTE +> 
// app.post('/AddToCarte/:id', async (req,res)=>{
//    let id = req.params.id
//    console.log('IS ' , id);
//    let y = req.cookies.token

//    if(!y){
//      res.redirect('/login')
//    }

//    let get = await ProModel.findOne({_id:id})

// })


app.get('/RemoveToCarte/:id', async (req,res)=>{
     let id = req.params.id
     let to = req.cookies.token
     let getUse = await UserModel.findOne({token:to})
     const {Carte} = getUse
     console.log('r' , id);
     let ind = Carte.findIndex((e)=> e.idP == id)
     Carte.splice(ind,1)
     await getUse.updateOne({Carte:Carte})
     res.redirect('/Carte')
})

app.get('/Plus/:id' , async (req,res)=>{
        let id = req.params.id
        console.log(id);
        let to = req.cookies.token
       let getUse = await UserModel.findOne({token:to})
        let get = await ProModel.findOne({_id:id})
       const {Carte} = getUse
    let ind = Carte.findIndex((e)=> e.idP == id)
      let ar = {idP:id,qu: Carte[ind].qu + 1 ,titel:get.titel,image:get.Images[0],price:get.price}
      Carte.splice(ind,1)
      await getUse.updateOne({Carte:[...Carte,ar]})
       res.redirect('/Carte')
})

app.get('/Mu/:id' , async (req,res)=>{
  try {
           let id = req.params.id
     let to = req.cookies.token
    let getUse = await UserModel.findOne({token:to})
    let get = await ProModel.findOne({_id:id})
     
     const {Carte} = getUse
      let ind = Carte.findIndex((e)=> e.idP == id)
     if(Carte[ind].qu  != 1) {
      let ar = {idP:id,qu: Carte[ind].qu - 1 ,titel:get.titel,image:get.Images[0],price:get.price}
      Carte.splice(ind,1)
      await getUse.updateOne({Carte:[...Carte,ar]})
       res.redirect('/Carte')
     }
     res.redirect('/Carte')
  } catch (err) {
     console.log(err);
  }
      
})

app.get('/AddOr', async (req,res)=>{
try {
         let to =  req.cookies.token
     let getUser = await UserModel.findOne({token:to})
     const {Carte} = getUser
     let y = 0
     let ar = []


     for (let i = 0; i < Carte.length; i++) {
        ar.push(Carte[i].idP)
        t = Carte[i].price * Carte[i].qu
        y= y + t
     }

    //  for (let j = 0; j < ar.length; j++) {
    //    let ii =  await UserModel.findOne({_id:ar[j]})
    //     jq.push(ii)
        
    //  }

     const OR = await OrModel.create({
        IdUser:getUser._id,
        total:y,
        ArPro:Carte
     }) 
     await getUser.updateOne({Carte:[]})
     res.redirect('/MyOrder')
} catch (err) {
     console.log(err);
}
})












const PORT = 4000

app.listen(PORT,()=>{
   console.log(`PORT IS ${PORT}`)
})