const mongoose = require("mongoose");
var Schema       = mongoose.Schema;

const ArticleSchema =  new Schema({
  title: String,
  content: String
});

module.exports = mongoose.model('Article', ArticleSchema);
