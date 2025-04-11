const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String },
  location: { type: String },
  contactInfo: { type: String }, // phone or email
  status: { type: String, default: 'Available' }, // e.g., 'Available', 'Rented', 'Exchanged'
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  coverImageUrl: { type: String } 
});

module.exports = mongoose.model('Book', bookSchema);
