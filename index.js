const express = require('express');
const { getTopics, getArticle, patchArticle, getUsers } = require('./controllers');
const { invalidPathError, customErrorHandler, unhandlesErrorHandler,  malformedBodyHandler, invalidSyntaxForType } = require('./errors/errorHandler');


const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/users", getUsers)

app.patch("/api/articles/:article_id", patchArticle)

//error handler for invalid paths
app.use("*", invalidPathError)

app.use("/", invalidSyntaxForType)

app.use(malformedBodyHandler)

//default error handlers
app.use(customErrorHandler)
app.use(unhandlesErrorHandler)

module.exports = app;