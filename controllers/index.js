const { selectTopics, selectArticle, updateArticle, selectUsers } = require("../models");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch(next)
};

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectArticle(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next)
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body
  updateArticle(article_id, body)
    .then((article) => {
      res.status(200).send({ article : article})
    })
    .catch(next)
}

exports.getUsers = (req, res, next) => {
  selectUsers() 
  .then((users) => {
    res.status(200).send(users);
  })
  .catch(next)
}
