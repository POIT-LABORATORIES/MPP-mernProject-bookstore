const {Schema, model, Types} = require("mongoose");

const userSchema = new Schema({
    title: {type: String, required: true},
    author: {type: String, required: true},
    pages: {type: String, required: true},
    isbn: {type: String, required: true, unique: true},
    owner: {type: Types.ObjectId, ref: "User"},
})

module.exports = model("Book", userSchema);