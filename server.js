// Import express and cors modules
const express = require("express");
const cors = require("cors");

// Import user routes from the user.js file in the routes folder
const user = require("./routes/user");

// Initialize express application
const app = express();

// Middleware to parse incoming requests with JSON content
app.use(express.json());

// CORS configuration to allow cross-origin requests from the specified origin (in this case, localhost on port 3000)
const corsOptions = {
    origin: "http://localhost:3000"
};
app.use(cors(corsOptions));  // Enable CORS with defined options

// A simple route for the server's root. Accessing the root route will return a welcome message in JSON format
app.get("/", (req, res) => {
    res.json({ message: "Welcome to MigraCode Auth application." });
});

// Set the port on which the server will run. Uses the value from the PORT environment variable if defined, otherwise, it uses port 3000
const PORT = process.env.PORT || 3000;

// Use the routes defined in user.js for all routes starting with '/user'
app.use("/user", user);

// Start the server to listen for requests on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
