const db = require("../db/connection");

exports.selectTopics = async () => {
  const text = "Select * FROM topics;";
  const result = await db.query(text);
  return result.rows;
};

exports.selectArticle = async (article_id) => {
  const text = "Select * FROM articles WHERE article_id = $1;";
  const result = await db.query(text, [article_id]);
  const article = result.rows[0];
  if (!article) throw { status: 404, msg: "This article id does not exist !" }; //could throw RefernceError object instead
  return article;
};

exports.updateArticle = async (article_id, body) => {
  let text = "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;"
  let queryValues = [article_id, body.inc_votes]
  const result = await db.query(text, queryValues)
  const article = result.rows[0];
  if (!article) throw { status: 404, msg: "This article id does not exist !" }
  return article;

}