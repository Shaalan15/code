const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const http =  require('http')
const port = 8000
const url = require('url');
const expressFormData = require('express-form-data');
const passport = require('passport');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express(); 
const UserRoutes = require('./routes/UserRoutes');
const DocumentRoutes = require('./routes/DocumentRoutes');

app.use(express.urlencoded({ extended: false }));
// Configure server to read json data in body
app.use(express.json());
// Configure server to read form data, or files
app.use(expressFormData.parse());
// Allow Cross-Origin Resource Sharing
app.use(cors())


const connectionString = "mongodb+srv://admin:Bombardo01@cluster0.yrwle.mongodb.net/Wathaeq?retryWrites=true&w=majority";
// Connection configuration for mongoose
const connectionConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose
.connect(connectionString, connectionConfig)
.then(
    () => {
        console.log('connected to database');
    }
)
.catch(
    (error) => {
        console.log('database error', error);
    }
);
app.get('/', (req,res) => {
    res.json({
        success: true
    })
})

app.post('/', (req, res) => {
    console.log(req.body)
    res.status(200)
  })
app.use('/user' ,UserRoutes);
app.use('/document' ,DocumentRoutes);
app.listen(port, () => {
 console.log(`Example app listening at http://localhost:${port}`)
})

var multer = require('multer');
var path = require('path')
const directoryPath = path.join(__dirname,'Uploads');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) //Appending extension
  }
})

var upload = multer({ storage: storage });

  app.get('/download/:name',(req,res)=>{
    DocumentsModel.find({name:req.params.name},(err,data)=>{
        console.log(req.params);
        if(err){

           console.log(err)
       }
       else{
          console.log(data);
          var path= __dirname+'/uploads/'+data[0].name;
          console.log(path);
          res.download(path);
       }
   })
})
