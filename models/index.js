const db = require("../db/connection");
const endpoints = require('../endpoints.json');

exports.selectTopics = async () => {
  const queryStr = "Select * FROM topics;";
  const result = await db.query(queryStr);
  return result.rows;
};

exports.selectArticle = async (article_id) => {
  const queryStr =
    "SELECT articles.*, CAST(COUNT(comments.article_id) AS int) AS comment_count FROM articles JOIN comments USING (article_id) WHERE article_id = $1 GROUP BY article_id;";
  const result = await db.query(queryStr, [article_id]);
  const article = result.rows[0];
  if (!article) throw { status: 404, msg: "This article id does not exist !" }; //could throw RefernceError object instead
  return article;
};

exports.selectArticles = async (sortBy = "created_at", orderBy = "desc", topic) => {
  orderBy = orderBy.toUpperCase();


  if (!["ASC", "DESC"].includes(orderBy)) throw { status: 400, msg: "Invalid Order Query" };

  const validSortBy = ["article_id","title", "topic", "author", "body", "created_at", "votes"];
  if(!validSortBy.includes(sortBy)) throw { status: 400, msg: "Invalid Sort Query"};

  let values = [];
  let queryStr = `SELECT articles.*, CAST(COUNT(comments.article_id) AS int) AS comment_count FROM articles LEFT OUTER JOIN comments USING (article_id) `;

  if (topic) {
    const testIfExists = await db.query(`SELECT * FROM articles WHERE topic = $1`, [topic]);
    if (!testIfExists.rows[0]) throw { status: 404, msg: "This topic does not exist in table" }
    queryStr += `WHERE topic = $1 `;
    values.push(topic);
  }
  queryStr += `GROUP BY article_id ORDER BY ${sortBy} ${orderBy};`;

  const result = await db.query(queryStr, values);
  return result.rows;
};

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
  const result = await db.query(queryStr);
  return result.rows;
};

exports.selectComments = async (article_id) => {
  const queryStr = "SELECT * FROM comments WHERE article_id = $1";
  const queryValues = [article_id];
  const result = await db.query(queryStr, queryValues);
  if (!result.rows[0]) {
    const article = await db.query(
      "SELECT * FROM articles WHERE article_id = $1",
      queryValues
    ); //test to see if the article exists but has no comments
    if (!article.rows[0])
      throw { status: 404, msg: "This article id does not exist !" };
    else return result.rows;
  }
  return result.rows;
};

exports.createComment = async (article_id, bodyinfo) => {
  const { username, body } = bodyinfo;
  const queryValues = [username, body, article_id];
  const queryStr =
    "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;";
  const result = await db.query(queryStr, queryValues);
  const comment = result.rows[0];
  return comment;
};

exports.removeComment = async (comment_id) => {
  const testExists = await db.query("SELECT * FROM comments WHERE comment_id = $1", [comment_id])
  if(!testExists.rows[0]) throw { status : 404, msg : "This comment doesn't exist"}
  const queryStr = 'DELETE FROM comments WHERE comment_id = $1'
  await db.query(queryStr, [comment_id]);
}
