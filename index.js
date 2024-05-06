const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://localhost:27017/onebytefood');
const db = mongoose.connection;
db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

app.post("/sign_in", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.collection('customersignup').findOne({ email: email }, (err, user) => {
        if (err) {
            console.log("Error in Server " + err);
            return res.status(500).json({ message: 'Something went wrong with the server' });
        }

        if (!user) {
            // User not found, send JSON response
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.password === password) {
            console.log("Login in successful")
            // Send response with user's name
            console.log(user.name);
            return res.status(200).json({ success: true, name: user.name });
        } else {
            return res.status(401).send('Credentials do not match');
        }
    });
});

app.post("/sign_up", (req, res) => {
    const name = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const data = {
        "name": name,
        "email": email,
        "password": password
    };
    db.collection('customersignup').insertOne(data, (err, collection) => {
        if (err) {
            throw err;
        }
        console.log("Record Inserted Successfully");
        // Send response with user's name
        res.status(200).json({ success: true, name: name });
    });
});

// Define reservation schema
/***const reservationSchema = new mongoose.Schema({
    name: String,
    email: String,
    date: Date,
    time: String,
    tableNumber: Number
});
const Reservation = mongoose.model("Reservation", reservationSchema);***/



// Handle reservation requests
app.post("/reserve_table", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const date = req.body.date;
    const time = req.body.time;
    const tableNumber = req.body.tableNumber;

    console.log("Name:", name); // Check if name is correct
    console.log("Email:", email); // Check if email is correct
    console.log("Date:", date); // Check if date is correct
    console.log("Time:", time); // Check if time is correct
    console.log("Table Number:", tableNumber); // Check if table number is correct+

    const newReservation = new Reservation({
        "name": name,
        "email": email,
        "date": date,
        "time": time,
        "tableNumbwe":tableNumber
    });

    newReservation.save((err, reservation) => {
        if (err) {
            console.error("Error saving reservation:", err);
            return res.status(500).json({ message: "Failed to reserve table" });
        }

        res.status(200).json({ message: "Table reserved successfully" });
    });
});

app.get("/", (req, res) => {
    res.set({
        "Allow-acces-Allow-Origin": '*'
    });
    return res.redirect('/homepage/homepage.html');
}).listen(3001);

console.log("Listening on port 3001");
// Define schema for data
const dataSchema = new mongoose.Schema({
    userName: String,
    emailAddress: String,
    date: Date,
    time: String,
    tableNumber: Number
    // Add more fields as needed
});

// Define model
const Data = mongoose.model('reservations', dataSchema);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route to handle incoming array of variables
app.post('/sendData', (req, res) => {
    const dataArray = req.body;

    // Save each value of userName, emailAddress, and date to MongoDB
    Data.insertMany(dataArray)
        .then(() => {
            console.log('Data array saved to MongoDB');
            res.sendStatus(200); // Send response back to client
        })
        .catch(error => {
            console.error('Error saving data array to MongoDB:', error);
            res.sendStatus(500); // Send internal server error response
        });
});
