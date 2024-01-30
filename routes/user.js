// Importing necessary modules
const express = require("express");
const bcrypt = require("bcrypt");   // bcrypt is used for password hashing
const fs = require("fs");   // fs (File System) module to work with the file system

// Importing the mock database (json file in this case)
const usersDb = require("../database/db.json");   // Load existing user data from db.json file

// Importing JWT generation utility
const generateJWT = require("../utils/generateJWT");

// Creating a new router using Express's Router method
const router = express.Router();

// POST endpoint for user registration/sign-up
router.post("/sign-up", async (req, res) => {
    const { name, email, password } = req.body; // Extracting name, email, and password from request body

    try {
        // Check if the user already exists based on email
        const user = await usersDb.filter(user => user.email === email);

        // If user exists, return an error response
        if (user.length > 0) {
            return res.status(400).json({ error: "User already exists!" });
        }

        // Generate salt for password hashing. Salt is a random string that is used to generate the hash for the password and is prepended to the hashed password. This ensures that even if two users have the same password, their hashed passwords will be different.
        const salt = await bcrypt.genSalt(10);
        // Hashing the password
        const bcryptPassword = await bcrypt.hash(password, salt);

        // Create a new user object
        let newUser = {
            id: usersDb.length,
            name,
            email,
            password: bcryptPassword
        };
        //usersDb.length is the length of the usersDb array. Since the array is zero-indexed, the length will be equal to the index of the last element + 1. This will be used as the id for the new user.

        // Add the new user to the users database array
        usersDb.push(newUser);

        // Save the updated users array to db.json file using fs module
        await fs.writeFileSync('./database/db.json', JSON.stringify(usersDb));

        // Generate a JWT token for the new user
        const jwtToken = generateJWT(newUser.id);

        // Send the JWT token back to the user
        return res.status(201).send({ jwtToken, isAuthenticated: true });

    } catch (error) {
        // Log and return any errors that occur
        console.error(error.message);
        res.status(500).send({ error: error.message });
    }
});

// Export the router to be used in server.js
module.exports = router;
