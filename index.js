const express = require('express');
const { getTopics, getArticle } = require('./controllers');
const { invalidPathError, customErrorHandler, unhandlesErrorHandler, badIdhandler } = require('./errors/errorHandler');


const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

//error handler for invalid paths
app.use("*", invalidPathError)

app.use('/', badIdhandler)

//default error handlers
app.use(customErrorHandler)
app.use(unhandlesErrorHandler)

module.exports = app;