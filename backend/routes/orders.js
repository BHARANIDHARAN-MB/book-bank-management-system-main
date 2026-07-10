const express = require('express');
const BookOrder = require('../models/BookOrder');
const Book = require('../models/Book');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Get orders (student sees own, librarian sees all)
router.get('/', auth, async (req, res) => {
  try {
    const query = req.user.role === 'student' ? { student: req.user._id } : {};
    const { status } = req.query;
    if (status) query.status = status;

    const orders = await BookOrder.find(query)
      .populate('student', 'name email studentId')
      .populate('book', 'title author isbn')
      .populate('processedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create order (student)
router.post('/', auth, authorize('student'), async (req, res) => {
  try {
    const { book: bookId, requiredDate, purpose, remarks } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.availableCopies < 1) return res.status(400).json({ message: 'No copies available' });

    // Check if student already has active order for same book
    const existingOrder = await BookOrder.findOne({
      student: req.user._id,
      book: bookId,
      status: { $in: ['pending', 'approved'] }
    });
    if (existingOrder) return res.status(400).json({ message: 'You already have an active order for this book' });

    const order = new BookOrder({
      student: req.user._id,
      book: bookId,
      requiredDate,
      purpose,
      remarks
    });
    await order.save();
    await order.populate(['book', { path: 'student', select: 'name email' }]);

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update order status (librarian)
router.put('/:id/status', auth, authorize('librarian'), async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const order = await BookOrder.findByIdAndUpdate(
      req.params.id,
      { status, remarks, processedBy: req.user._id, processedAt: new Date() },
      { new: true }
    ).populate(['student', 'book']);

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Cancel order (student - own orders only)
router.put('/:id/cancel', auth, authorize('student'), async (req, res) => {
  try {
    const order = await BookOrder.findOne({ _id: req.params.id, student: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!['pending'].includes(order.status)) return res.status(400).json({ message: 'Order cannot be cancelled' });

    order.status = 'cancelled';
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
