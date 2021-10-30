// ------------------------------------- Importing the necessary files
const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const UsersModel = require('../models/UserModel.js');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
// ------------------------------------- Creating a route for user add
// http://www.myapp.com/user/add
router.post(
    '/signup',
    (req, res) => {
        // (1) Getting the form data from user
        const formData = {
            "userName": req.body.userName,
            "password": req.body.password,
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "email": req.body.email,
            "phoneNumber": req.body.phoneNumber,
        };

        // (2) Create instance of UsersModel
        const newUsersModel = new UsersModel(formData);

        // (3) Check if email exists
        UsersModel
        .findOne(
            { email: formData.email }
        )
        // If findOne() connects to MongoDB
        .then(
            // Start an async function
            async (dbDocument) => {
                // (4.a) if email already in database
                if(dbDocument) {
                    res.send("Sorry. An account with that email already exists");
                }
                // (4.b) if email not in database
                else {
                    // (5) Create a hashed password for user
                    // (5.a) Generate salt
                    bcryptjs.genSalt(
                        (err, theSalt) => {
                            // (6) Hash function for the password
                            bcryptjs.hash(
                                formData.password,
                                theSalt,
                                (err, hashedPassword) => {
                                    // Set newUsersModel password to the hashed password created
                                    newUsersModel.password = hashedPassword;
                                    // (7) Saving the new password in the database
                                    newUsersModel
                                    .save()
                                    // If MongoDB connects
                                    .then( 
                                        (dbDocument) => {
                                            res.send(dbDocument)
                                        }
                                    )
                                    // If MongoDB doesn't connect
                                    .catch( 
                                        (error) => {
                                            console.log('error', error);
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            }
        )
        // If connection to MongoDB fails
        .catch(
            (error) => {
                res.send('error')
            }
        )
    }
);

// ------------------------------------- Creating route for user update
// http://www.myapp.com/user/update
router.post(
    '/update',
    (req, res) => {

        let newPassword; 

        bcryptjs.genSalt(
            (err, theSalt) => {
                // (6) Hash function for the password
                bcryptjs.hash(
                    req.body.password,
                    theSalt,
                    (err, hashedPassword) => {
                        newPassword = hashedPassword;

                        UsersModel
                        .findOneAndUpdate(
                            { email: req.body.email },
                            {
                                $set: {
                                    "password": newPassword
                                }
                            }
                        )
                        .then(
                            (dbDocument) => {
                                res.send(dbDocument)
                            }
                        )
                        .catch(
                            (error) => {
                                res.send("error", error)
                            }
                        )
                    }
                );
            }
        );
        
        UsersModel
        .findOneAndUpdate(
            { email: req.body.email },
            {
                $set: {
                    "userName": req.body.userName,
                    "firstName": req.body.firstName,
                    "lastName": req.body.lastName,
                    "phoneNumer": req.body.phoneNumber,
                    "address": req.body.address,
                }
            }
        )
        .then(
            (dbDocument) => {
                res.send(dbDocument)
            }
        )
        .catch(
            (error) => {
                res.send("error", error)
            }
        )
    }
);

// ------------------------------------- Creating a route for user login
// http://www.myapp/com/user/login
router.post(
    '/login',
    (req, res) => {
        // (1) Capturing user data 
        const formData = {
            "userName": req.body.userName,
            "password": req.body.password
        };

        // (2) Checking for user existence in database
        UsersModel
            .findOne({ userName: formData.userName })
        .then(
            (dbDocument) => {
                // (3.a) If no account match found
                if (!dbDocument) {
                    res.send("Sorry. Wrong username or password");
                }
                // (3.b) if there is a match in database 
                else {
                    // (4) Check if password is correct 
                    bcryptjs 
                    .compare(formData.password, dbDocument.password)
                    // If MongoDB connects
                    .then(
                        (isMatch) => {
                            // (5.a) If password is incorrect, reject login 
                            if (!isMatch) {
                                res.send("Sorry. Wrong username or password");
                            }
                            // (5.b) If password is correct 
                            else {
                                // (6) Prepare payload of web token
                                const payload = {
                                    // Payload consist of userID only 
                                    id: dbDocument.id
                                }
                                // (7) Send the jsonwebtoken to client 
                                jwt 
                                .sign(
                                    payload, 
                                    jwtSecret, 
                                    (err, jsonwebtoken) => {
                                        res.json({
                                            userName: dbDocument.userName,
                                            email: dbDocument.email,
                                            avatar: dbDocument.avatar,
                                            jsonwebtoken
                                        });
                                    }
                                );
                            }
                        }
                    )
                    // If MongoDB doesn't connect
                    .catch(
                        (error) => {
                            res.send(error);
                        }
                    )
                }
            }
        )
        .catch(
            (error) => {
                res.send(error);
            }
        )
    }
);

// ------------------------------------- Creating a route for generic user
// http://www.myapp.com/user/:name

// Exporting
module.exports = router;
