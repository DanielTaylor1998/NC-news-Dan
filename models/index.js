const db = require("../db/connection");

exports.selectTopics = async () => {
  const queryStr = "Select * FROM topics;";
  const result = await db.query(queryStr);
  return result.rows;
};

exports.selectArticle = async (article_id) => {
  const queryStr = "SELECT articles.*, CAST(COUNT(comments.article_id) AS int) AS comment_count FROM articles JOIN comments USING (article_id) WHERE article_id = $1 GROUP BY article_id;";
  const result = await db.query(queryStr, [article_id]);
  const article = result.rows[0];
  if (!article) throw { status: 404, msg: "This article id does not exist !" }; //could throw RefernceError object instead
  return article;
};

exports.selectArticles = async () => {
  const queryStr = "SELECT articles.*, CAST(COUNT(comments.article_id) AS int) AS comment_count FROM articles LEFT OUTER JOIN comments USING (article_id) GROUP BY article_id ORDER BY created_at DESC;"
  const result = await db.query(queryStr);
  return result.rows;
}

exports.updateArticle = async (article_id, body) => {
  let queryStr =
    "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;";
  let queryValues = [article_id, body.inc_votes];
  const result = await db.query(queryStr, queryValues);
  const article = result.rows[0];
  if (!article) throw { status: 404, msg: "This article id does not exist !" };
  return article;
};

exports.selectUsers = async () => {
  const queryStr = "SELECT * FROM users";
  const result = await db.query(queryStr)
  return result.rows;
}

exports.selectComments = async (article_id) => {
  const queryStr = "SELECT * FROM comments WHERE article_id = $1"
  let queryValues = [article_id]
  const result = await db.query(queryStr, queryValues)
  if (!result.rows[0]) throw { status: 404, msg: "This article id does not exist !" }
  return result.rows;
}

exports.createComment = async (article_id, bodyinfo) => {
  const { username, body} = bodyinfo
  const queryValues = [username, body, article_id]
  const queryStr = "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;"
  const result = await db.query(queryStr, queryValues);
  const comment = result.rows[0];
  return comment
}
