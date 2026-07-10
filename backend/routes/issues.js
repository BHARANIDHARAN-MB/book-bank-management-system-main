const express = require('express');
const BookIssue = require('../models/BookIssue');
const Book = require('../models/Book');
const BookOrder = require('../models/BookOrder');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Get all issues (librarian sees all, student sees own)
router.get('/', auth, async (req, res) => {
  try {
    const query = req.user.role === 'student' ? { student: req.user._id } : {};
    const { status } = req.query;
    if (status) query.status = status;

    const issues = await BookIssue.find(query)
      .populate('student', 'name email studentId phone')
      .populate('book', 'title author isbn category')
      .populate('issuedBy', 'name')
      .sort({ createdAt: -1 });

    // Update overdue status
    for (let issue of issues) {
      if (issue.status === 'issued' && new Date() > issue.dueDate) {
        issue.status = 'overdue';
        const daysOverdue = Math.floor((new Date() - issue.dueDate) / (1000 * 60 * 60 * 24));
        issue.fineAmount = daysOverdue * 2;
        await issue.save();
      }
    }

    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Issue a book (librarian only)
router.post('/', auth, authorize('librarian'), async (req, res) => {
  try {
    const { student, book: bookId, dueDate, remarks, orderRef } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.availableCopies < 1) return res.status(400).json({ message: 'No copies available' });

    // Check if student already has this book issued
    const existingIssue = await BookIssue.findOne({
      student,
      book: bookId,
      status: { $in: ['issued', 'overdue'] }
    });
    if (existingIssue) return res.status(400).json({ message: 'Student already has this book issued' });

    const issue = new BookIssue({
      student,
      book: bookId,
      issuedBy: req.user._id,
      dueDate,
      remarks,
      orderRef
    });
    await issue.save();

    // Reduce available copies
    book.availableCopies -= 1;
    if (book.availableCopies === 0) book.status = 'unavailable';
    await book.save();

    // Update order status if linked
    if (orderRef) {
      await BookOrder.findByIdAndUpdate(orderRef, { status: 'fulfilled' });
    }

    await issue.populate([
      { path: 'student', select: 'name email studentId' },
      { path: 'book', select: 'title author isbn' },
      { path: 'issuedBy', select: 'name' }
    ]);

    res.status(201).json(issue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get issue stats (librarian)
router.get('/stats', auth, authorize('librarian'), async (req, res) => {
  try {
    const total = await BookIssue.countDocuments();
    const issued = await BookIssue.countDocuments({ status: 'issued' });
    const overdue = await BookIssue.countDocuments({ status: 'overdue' });
    const returned = await BookIssue.countDocuments({ status: 'returned' });

    res.json({ total, issued, overdue, returned });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
