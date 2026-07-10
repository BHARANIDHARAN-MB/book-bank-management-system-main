const express = require('express');
const Book = require('../models/Book');
const BookEntry = require('../models/BookEntry');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Get all books (all roles)
router.get('/', auth, async (req, res) => {
  try {
    const { search, category, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) query.category = category;
    if (status) query.status = status;

    const books = await Book.find(query)
      .populate('addedBy', 'name email')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(query);

    res.json({ books, total, pages: Math.ceil(total / limit), currentPage: page });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single book
router.get('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('addedBy', 'name email');
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add book (vendor only)
router.post('/', auth, authorize('vendor', 'librarian'), async (req, res) => {
  try {
    const bookData = { ...req.body, addedBy: req.user._id };
    const book = new Book(bookData);
    await book.save();

    // Create entry record
    await BookEntry.create({
      book: book._id,
      enteredBy: req.user._id,
      entryType: 'new_arrival',
      quantityAdded: book.totalCopies,
      reason: 'Initial stock added',
      vendorRef: req.user.role === 'vendor' ? req.user._id : null
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update book (librarian/vendor)
router.put('/:id', auth, authorize('librarian', 'vendor'), async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete book (librarian only)
router.delete('/:id', auth, authorize('librarian'), async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
