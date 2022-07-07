const articles = require("../db/data/test-data/articles");
const {
  selectTopics,
  selectArticle,
  updateArticle,
  selectUsers,
  selectArticles,
  selectComments,
  createComment,
  removeComment,
} = require("../models");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  let sort_by = req.query.sort_by;

  if (sort_by === "date") {
    sort_by = "created_at"
  }

  let topic = req.query.topic

  let orderBy = req.query.order

  selectArticles(sort_by, orderBy, topic)
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);
};

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectArticle(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body;
  updateArticle(article_id, body)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};

exports.getCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  selectComments(article_id)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body;
  createComment(article_id, body)
    .then((comment) => {
      res.status(201).send({ comment: comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).end()
    })
    .catch(next);
}