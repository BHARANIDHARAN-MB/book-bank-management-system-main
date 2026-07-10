const express = require('express');
const BookEntry = require('../models/BookEntry');
const Book = require('../models/Book');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Get all entries
router.get('/', auth, authorize('librarian', 'vendor'), async (req, res) => {
  try {
    const entries = await BookEntry.find()
      .populate('book', 'title author isbn')
      .populate('enteredBy', 'name role')
      .populate('vendorRef', 'name email')
      .sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create entry (librarian)
router.post('/', auth, authorize('librarian'), async (req, res) => {
  try {
    const { book: bookId, entryType, quantityAdded, quantityRemoved, reason, vendorRef, invoiceNumber } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const entry = new BookEntry({
      book: bookId,
      enteredBy: req.user._id,
      entryType,
      quantityAdded: quantityAdded || 0,
      quantityRemoved: quantityRemoved || 0,
      reason,
      vendorRef,
      invoiceNumber
    });
    await entry.save();

    // Update book copies
    book.totalCopies += (quantityAdded || 0) - (quantityRemoved || 0);
    book.availableCopies += (quantityAdded || 0) - (quantityRemoved || 0);
    if (book.availableCopies < 0) book.availableCopies = 0;
    await book.save();

    await entry.populate([
      { path: 'book', select: 'title author' },
      { path: 'enteredBy', select: 'name' }
    ]);

    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
