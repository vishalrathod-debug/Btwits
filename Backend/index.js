console.log("App starting...");
require('dotenv').config();
const express = require("express");
const cors = require('cors');

const dbConnection = require('./config/db');
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();


// middleware
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// start server function
const startServer = async () => {
    try {
        await dbConnection();

        app.listen(process.env.PORT || 3000, () => {
            console.log("Server is running on:", process.env.PORT || 3000);
        });

    } catch (error) {
        console.log("Error occurred:", error);
        process.exit(1);
    }
};

startServer();