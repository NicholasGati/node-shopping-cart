var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Write how the data you're working with should look like in the DB.
var schema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  cart: {type: Object, required: true},
  address: {type: String, required: true},
  name: {type: String, required: true},
  paymentId: {type: String, required: true}
});

// Export the model and schema. mongoose.model(name of product, the schema name)
module.exports = mongoose.model('Order', schema);
