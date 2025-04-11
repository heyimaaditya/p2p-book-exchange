const Book = require('../models/Book');

exports.createBook = async (req, res) => {
  try {
    const { userId } = req;
    const { title, author, genre, location, contactInfo, coverImageUrl } = req.body;

    if (!title || !author) {
      return res.status(400).json({ msg: 'Title and Author are required.' });
    }

    const newBook = new Book({
      title,
      author,
      genre,
      location,
      contactInfo,
      coverImageUrl,
      owner: userId
    });
    const savedBook = await newBook.save();
    return res.status(201).json({ msg: 'Book listed successfully', book: savedBook });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const { title, location, genre } = req.query;
    let query = {};

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (genre) {
      query.genre = { $regex: genre, $options: 'i' };
    }

    const books = await Book.find(query).populate('owner', 'name email mobile');
    return res.json({ books });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id).populate('owner', 'name email mobile');
    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }
    return res.json({ book });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;
    const { title, author, genre, location, contactInfo, status } = req.body;

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ msg: 'Book not found' });

    if (book.owner.toString() !== userId) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    if (title) book.title = title;
    if (author) book.author = author;
    if (genre) book.genre = genre;
    if (location) book.location = location;
    if (contactInfo) book.contactInfo = contactInfo;
    if (status) book.status = status;

    await book.save();
    return res.json({ msg: 'Book updated successfully', book });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ msg: 'Book not found' });

    if (book.owner.toString() !== userId) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await book.deleteOne();
    return res.json({ msg: 'Book deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
};
