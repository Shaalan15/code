const express = require('express');
const { Mongoose } = require('mongoose');
const Router = express.Router();
const DocumentsModel = require('../models/DocumentModel.js');
const bodyParser = require('body-parser')



Router.use(bodyParser.json());
Router.use(bodyParser.urlencoded({ extended: true }));

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

Router.get(
    '/list',
    (req, res) => {

        // Use the Mongo Model for Products to find a product
        DocumentsModel
        .find()
        // If the item is found in the database...
        .then(foundDocuments => res.json((foundDocuments)))
        // If the item is NOT found in the database...
        .catch(
            (error) => {
                console.log('mongoose error', error);
            }
        );
}
)
Router.post('/upload', upload.single('document'),(req , res) => {

    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
  
    const formData = {
              "name": req.body.name,
              "size": req.body.size,
              "uri": 'http://api.sianet.me:8000/download/' + req.body.name,
              "date": year + "-" + month + "-" + date
          };
   const newDocumentsModel = new DocumentsModel(formData);
   newDocumentsModel
          .save() //  Promise
          .then( //resolved...
              (dbDocument) => {
                  res.send(dbDocument);
              }
          )
          .catch( //rejected...
              (error) => {
                  res.send(error)
              }
          );
});

module.exports = Router;
