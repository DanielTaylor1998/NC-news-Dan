const express = require('express');
const { getTopics } = require('./controllers');
const { invalidPathError } = require('./errors/errorHandler');


const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

//error handler for invalid paths
app.use("*", invalidPathError)

module.exports = app;