const express = require('express');
const { getTopics, getArticle } = require('./controllers');
const { invalidPathError, customErrorHandler, unhandlesErrorHandler } = require('./errors/errorHandler');


const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

//error handler for invalid paths
app.use("*", invalidPathError)
app.use(customErrorHandler)
app.use(unhandlesErrorHandler)

module.exports = app;