const db = require("../db/connection");

exports.selectTopics = async () => {
  let text = "Select * FROM topics;";
  const result = await db.query(text);
  return result.rows;
};


exports.selectArticle = async (article_id) => {
  let text = "Select * FROM articles WHERE article_id = $1;"
  const result = await db.query(text, [article_id]);
  return result.rows[0];
}