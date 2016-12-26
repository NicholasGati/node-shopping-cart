var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Write how the data you're working with should look like in the DB.
var schema = new Schema({
  imagePath: {type: String, required: true},
  title: {type: String, required: true},
  description: {type: String, required: true},
  price: {type: Number, required: true}
});

// Export the model and schema. mongoose.model(name of product, the schema name)
module.exports = mongoose.model('product', schema);
