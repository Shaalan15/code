const mongoose = require('mongoose');


// Creating the products schema
const DocumentSchema = mongoose.Schema(
    {
        // Name is required
        name: {
            type: String,
            required: true
        },
        // Size is required
        size: {
            type: Number,
            required: true
        },
        // URI is required
        uri: {
            type: String,
            required: true
        },
        date:{
            type: String,
            required: false
        }
    }
);

// Creating a model of the schema. Takes the collection name and the schema
const DocumentsModel = new mongoose.model('documents', DocumentSchema);

module.exports = DocumentsModel;
