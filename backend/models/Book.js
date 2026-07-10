const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Science', 'Mathematics', 'Literature', 'History', 'Technology', 'Arts', 'Medicine', 'Law', 'Business', 'Other']
  },
  publisher: String,
  publishedYear: Number,
  totalCopies: {
    type: Number,
    required: true,
    min: 0,
    default: 1
  },
  availableCopies: {
    type: Number,
    required: true,
    min: 0,
    default: 1
  },
  price: {
    type: Number,
    min: 0
  },
  description: String,
  coverImage: {
    type: String,
    default: ''
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['available', 'unavailable', 'discontinued'],
    default: 'available'
  },
  tags: [String]
}, { timestamps: true });

bookSchema.virtual('isAvailable').get(function() {
  return this.availableCopies > 0;
});

module.exports = mongoose.model('Book', bookSchema);
