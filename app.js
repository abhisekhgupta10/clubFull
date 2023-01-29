const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const dotenv = require('dotenv')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000
const app = express()
// const multer = require('multer')
// const fs = require('fs')
app.set('view engine','ejs')
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb",  extended: true, parameterLimit: 1000000 }))
app.use(express.static('public'))
mongoose.set('strictQuery', true);

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// });

// const upload = multer({ storage: storage });

async function main() {
    try {
    mongoose.connect('mongodb+srv://Abhisekh_:Mah%40dev10@cluster0.jdw7xdp.mongodb.net/amcDB',{
        useNewUrlParser:true,
        useUnifiedTopology:true,
     
    });
    console.log('connected')
    } catch (error) {
        console.log(error)
    }
  
}
main()


const postSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    body:{
        type:String,
        require:true
    },
    // featuredImg:
    // {
    //     data: Buffer,
    //     contentType: String
    // }
})

const post = mongoose.model('post',postSchema)

const memberSchema = new mongoose.Schema({
    Fullname:{
        type:String,
        require:true
    },
    Email:{
        type:String,
        require:true,
        unique:true
    },
    Password:{
        type:String,
        require:true
    },
    Contact:{
        type:Number,
        require:true 
    },
    Address:{
        type:String,
        require:true
    },
    Faculty:{
        type:String,
        require:true
    },
   Semester:{
    type:String,
    require:true
   },
   Interest:{
    type:String,
    require:true
   }
})


const member = mongoose.model('member',memberSchema)

app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/register',(req,res)=>{
    res.render('register')
})

app.post('/register',(req,res)=>{
    const data = new member({
        Fullname:req.body.fullname,
        Email:req.body.email,
        Password:req.body.password,
        Contact:req.body.mobile,
        Address:req.body.address,
        Faculty:req.body.faculty,
        Semester:req.body.semester,
        Interest:req.body.interest
    })
    data.save((err)=>{
        if(err){
            res.render('err')
        }
        else{
            res.render('msg')
        }
    })
    
})

app.get('/login',(req,res)=>{
    res.render('login')
})
app.post('/login',(req,res)=>{
    member.findOne({Email:req.body.email},(err,docs)=>{
        if(err){
           res.render('err')
        }else{
            if(docs.Password==req.body.password){
                res.render('post')
             
            }else{
                res.send('Error occured')
            }
           
        }
    })
    
})


app.get('/event',(req,res)=>{
    res.render('event')
})

app.get('/blog',(req,res)=>{
    post.find((err,posts)=>{
        if(err){
            console.log(err)
        }
        else{
            res.render('blog',{
                posts:posts
            })
        }
    })
 
})

app.post('/blog',(req,res)=>{ //upload.single('img')
    const blog = new post({
        title:req.body.title,
        body:req.body.story,
        // featuredImg: {
        //     data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        //     contentType: 'image/png'
        // }
    
    })
    blog.save((err)=>{
        if(err){
            console.log(err)
        }else{
            res.redirect('/blog')
        }
    })
   
})



app.get('/post/:title',(req,res)=>{

   post.findOne({title:req.params.title},(err,post)=>{
    if(err){
        console.log(err)
    }else{
        res.render('content',{
            post:post
        })
    }
   })
})

app.get('*',(req,res)=>{
    res.render('404')
})
app.listen(PORT,()=>{
    console.log('Listening at '+PORT)
})
