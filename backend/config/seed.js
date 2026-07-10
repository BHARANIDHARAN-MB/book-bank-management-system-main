const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Book = require('../models/Book');

const seedData = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB for seeding...');

  // Clear existing data
  await User.deleteMany({});
  await Book.deleteMany({});

  // Create users
  const users = await User.insertMany([
    {
      name: 'Admin Librarian',
      email: 'librarian@bookbank.com',
      password: await bcrypt.hash('password123', 12),
      phone: '9876543210',
      role: 'librarian'
    },
    {
      name: 'Ravi Kumar',
      email: 'student@bookbank.com',
      password: await bcrypt.hash('password123', 12),
      phone: '9876543211',
      role: 'student',
      studentId: 'STU001',
      department: 'Computer Science'
    },
    {
      name: 'BookWorld Vendor',
      email: 'vendor@bookbank.com',
      password: await bcrypt.hash('password123', 12),
      phone: '9876543212',
      role: 'vendor'
    }
  ]);

  // Create books
  await Book.insertMany([
    {
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      isbn: '978-0262033848',
      category: 'Technology',
      publisher: 'MIT Press',
      publishedYear: 2009,
      totalCopies: 5,
      availableCopies: 5,
      price: 1200,
      description: 'A comprehensive introduction to modern algorithms.',
      addedBy: users[2]._id,
      tags: ['algorithms', 'computer science', 'programming']
    },
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '978-0132350884',
      category: 'Technology',
      publisher: 'Prentice Hall',
      publishedYear: 2008,
      totalCopies: 3,
      availableCopies: 3,
      price: 800,
      description: 'A handbook of agile software craftsmanship.',
      addedBy: users[2]._id,
      tags: ['programming', 'software engineering']
    },
    {
      title: 'Calculus: Early Transcendentals',
      author: 'James Stewart',
      isbn: '978-1285741550',
      category: 'Mathematics',
      publisher: 'Cengage Learning',
      publishedYear: 2015,
      totalCopies: 8,
      availableCopies: 8,
      price: 1500,
      description: 'Standard calculus textbook for engineering students.',
      addedBy: users[2]._id,
      tags: ['calculus', 'mathematics', 'engineering']
    },
    {
      title: 'Organic Chemistry',
      author: 'Paula Yurkanis Bruice',
      isbn: '978-0321803221',
      category: 'Science',
      publisher: 'Pearson',
      publishedYear: 2013,
      totalCopies: 4,
      availableCopies: 4,
      price: 1100,
      description: 'Comprehensive guide to organic chemistry.',
      addedBy: users[2]._id,
      tags: ['chemistry', 'organic', 'science']
    },
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0743273565',
      category: 'Literature',
      publisher: 'Scribner',
      publishedYear: 1925,
      totalCopies: 6,
      availableCopies: 6,
      price: 350,
      description: 'A classic novel of the American Dream.',
      addedBy: users[2]._id,
      tags: ['novel', 'classic', 'fiction']
    },
    {
      title: 'Data Structures and Algorithms',
      author: 'Mark Allen Weiss',
      isbn: '978-0132576277',
      category: 'Technology',
      publisher: 'Pearson',
      publishedYear: 2011,
      totalCopies: 7,
      availableCopies: 7,
      price: 950,
      description: 'Fundamental data structures and algorithms with Java.',
      addedBy: users[2]._id,
      tags: ['data structures', 'algorithms', 'java']
    },
    {
      title: 'Physics for Scientists and Engineers',
      author: 'Raymond A. Serway',
      isbn: '978-1133947271',
      category: 'Science',
      publisher: 'Cengage',
      publishedYear: 2013,
      totalCopies: 5,
      availableCopies: 5,
      price: 1300,
      description: 'Comprehensive physics for engineering students.',
      addedBy: users[2]._id,
      tags: ['physics', 'science', 'engineering']
    },
    {
      title: 'Principles of Economics',
      author: 'N. Gregory Mankiw',
      isbn: '978-1305585126',
      category: 'Business',
      publisher: 'Cengage',
      publishedYear: 2014,
      totalCopies: 4,
      availableCopies: 4,
      price: 1050,
      description: 'Leading economics textbook for undergraduates.',
      addedBy: users[2]._id,
      tags: ['economics', 'business', 'finance']
    }
  ]);

  console.log('✅ Seed data inserted successfully!');
  console.log('\n📝 Test Credentials:');
  console.log('Librarian: librarian@bookbank.com / password123');
  console.log('Student:   student@bookbank.com / password123');
  console.log('Vendor:    vendor@bookbank.com / password123');
  
  mongoose.disconnect();
};

seedData().catch(err => {
  console.error('Seed error:', err);
  mongoose.disconnect();
});
