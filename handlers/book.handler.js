const Book = require("../models/Book");

module.exports = (io, socket) => {
    const createBook = async (postedBook, userId, callback) => {
        try {
            const {isbn} = postedBook;
    
            const existing = await Book.findOne({ isbn });
            if (existing) {
                return callback({
                    isCreated: false,
                    message: "The book is already created"
                  });
            }
    
            const book = new Book({ 
                title: postedBook.title,
                author: postedBook.author,
                pages: postedBook.pages,
                isbn: postedBook.isbn,
                owner: userId
            });

            await book.save();
            
            callback({
                isCreated: true,
                book
            });
        } catch (e) {
            callback({
                isCreated: false,
                message: e.message
              });
        }
    }
  
    const readBook = async (bookId, callback) => {
        try {
            const book = await Book.findById(bookId);
            callback({
                success: true,
                book
            });
        } catch (e) {
            callback({
                success: false,
                message: e.message
            });
        }
    }

    const readAllBooksByUserId = async (userId, callback) => {
        try {
            const books = await Book.find({ owner: userId });
            callback({
                success: true,
                books
            })
        } catch (e) {
            callback({
                success: false,
                message: e.message
            })
        }
    }

    const updateBook = (bookId, callback) => {
        /*
        try {
            const fetchedBook = await Book.findById(req.params.id);
            const book = new Book({ 
                _id: fetchedBook.id,
                title: req.body.title ? req.body.title : fetchedBook.title,
                author: req.body.author ? req.body.author : fetchedBook.author,
                pages: req.body.pages ? req.body.pages : fetchedBook.pages,
                isbn: req.body.isbn ? req.body.isbn : fetchedBook.isbn
            });
            const updatedBook = await Book.findByIdAndUpdate(req.params.id, book, {new: true});
            res.json({message: "Book is updated", updatedBook});
        } catch (e) {
            console.log(e.message);
            res.status(500).json({ message: "Something went wrong, try again" });
        }
        */
    }

    const deleteBook = async (bookId, callback) => {
        try {
            const deletedBook = await Book.findByIdAndDelete(bookId);
            callback({
                isDeleted: true,
                deletedBook
              });
        } catch (e) {
            callback({
                isDeleted: false
              });
        }
    }
  
    socket.on("book:create", createBook);
    socket.on("book:read", readBook);
    socket.on("book:readAllByUID", readAllBooksByUserId);
    socket.on("book:update", updateBook);
    socket.on("book:delete", deleteBook);
  }