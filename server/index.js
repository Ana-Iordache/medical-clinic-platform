const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('../config.json');
const port = config.BACKEND_PORT;
const routes = require('./router/routes');
const cors = require('cors');
const mongoose = require("mongoose");

mongoose.set('strictQuery', false);
const dbURI = `mongodb://${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`;
const dbConnection = mongoose.connection;

dbConnection.on("disconnected", () => {
  setTimeout(() => {
    connectToMongoDB(dbURI);
  }, 5000);
});

dbConnection.on("reconnected", () => {
  console.log(`DB reconnected to ${dbURI}`);
});

dbConnection.once("open", () => {
  console.log(`Connected successfully to DB ${dbURI}`);
});

connectToMongoDB(dbURI);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON in the request body
app.use(bodyParser.json());

app.use(config.BASE_URI, routes)

function connectToMongoDB(uri) {
  mongoose.connect(uri)
  .catch(err => {
    console.log(`Failed to connect to DB ${uri}: ${err}`)
  })
}