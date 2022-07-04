const db = require("../db/connection");

exports.selectTopics = async () => {
  let text = "Select * FROM topics;";
  const result = await db.query(text);
  return result.rows;
};
