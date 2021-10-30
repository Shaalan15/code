const uniqueValidator = require('mongoose-unique-validator');  
// Importing mongoose to be able to make models and schemas
const mongoose = require('mongoose');

// Creating a schema
const UserSchema = mongoose.Schema(
    {
        // Most artists have an associated username which is more popular than their real name
        userName: {
            type: String,
            required: true
        },
        // Password is required. No need to explain
        password: {
            type: String,
            required: true
        },
        // First name isn't required, as username is more important
        firstName: {
            type: String,
        },
        // Last name isn't required, as username is more important
        lastName: {
            type: String,
        },
        // Email is required
        email: {
            type: String,
            required: true
        },
        // Phone number is required, so buyers can contact sellers and vice versa
        phoneNumber: {
            type: String,
            required: true
        },
        dataCreated: {
            type: Date,
            default: Date.now
        }
    }
);

UserSchema.plugin(uniqueValidator);  

// Making a model of the Schema. Tajes as argument the collection name, and Schema 
const UserModel = new mongoose.model('users', UserSchema);

// Exporting the model
module.exports = UserModel;
