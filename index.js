const express = require("express");
const {
  getTopics,
  getArticle,
  patchArticle,
  getUsers,
  getArticles,
  getCommentsById,
  postComment,
} = require("./controllers");
const {
  invalidPathError,
  customErrorHandler,
  unhandlesErrorHandler,
  malformedBodyHandler,
  invalidSyntaxForType,
  foreignKeyInvalidInsertHandler,
} = require("./errors/errorHandler");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/users", getUsers);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsById)

app.patch("/api/articles/:article_id", patchArticle);

app.post("/api/articles/:article_id/comments", postComment);

//error handler for invalid paths
app.use("*", invalidPathError);

app.use("/", invalidSyntaxForType);

app.use(malformedBodyHandler);

app.use(foreignKeyInvalidInsertHandler);

//default error handlers
app.use(customErrorHandler);
app.use(unhandlesErrorHandler);

module.exports = app;
