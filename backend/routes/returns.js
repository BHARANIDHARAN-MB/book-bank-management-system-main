const express = require('express');
const BookReturn = require('../models/BookReturn');
const BookIssue = require('../models/BookIssue');
const Book = require('../models/Book');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Get all returns
router.get('/', auth, async (req, res) => {
  try {
    const query = req.user.role === 'student' ? { student: req.user._id } : {};
    const returns = await BookReturn.find(query)
      .populate('student', 'name email studentId')
      .populate('book', 'title author isbn')
      .populate('returnedTo', 'name')
      .populate('issue')
      .sort({ createdAt: -1 });
    res.json(returns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Process return (librarian or student self-return)
router.post('/', auth, async (req, res) => {
  try {
    const { issueId, condition, remarks } = req.body;

    const issue = await BookIssue.findById(issueId).populate('book');
    if (!issue) return res.status(404).json({ message: 'Issue record not found' });
    if (issue.status === 'returned') return res.status(400).json({ message: 'Book already returned' });

    // Students can only return their own books
    if (req.user.role === 'student' && issue.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Calculate fine
    let fineCollected = 0;
    if (new Date() > issue.dueDate) {
      const daysOverdue = Math.floor((new Date() - issue.dueDate) / (1000 * 60 * 60 * 24));
      fineCollected = daysOverdue * 2;
    }

    // Create return record
    const returnRecord = new BookReturn({
      issue: issueId,
      student: issue.student,
      book: issue.book._id,
      returnedTo: req.user.role === 'librarian' ? req.user._id : null,
      condition,
      fineCollected,
      remarks
    });
    await returnRecord.save();

    // Update issue
    issue.status = 'returned';
    issue.returnDate = new Date();
    issue.fineAmount = fineCollected;
    issue.finePaid = fineCollected > 0;
    await issue.save();

    // Restore available copies
    const book = issue.book;
    book.availableCopies += 1;
    if (book.status === 'unavailable') book.status = 'available';
    await book.save();

    await returnRecord.populate([
      { path: 'student', select: 'name email' },
      { path: 'book', select: 'title author' },
      { path: 'returnedTo', select: 'name' }
    ]);

    res.status(201).json({ returnRecord, fine: fineCollected });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
