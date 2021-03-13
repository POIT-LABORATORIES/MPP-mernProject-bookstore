const {Router} = require("express");
const config = require("config");
const shortId = require("shortid");
const Book = require("../../models/Book");
const router = Router();
const auth = require("../../middleware/auth.middleware");


router.post("/", auth, async (req, res) => {
    try {
        const {isbn} = req.body;

        const existing = await Book.findOne({ isbn });
        if (existing) {
            return res.json({ book: existing });
        }

        const book = new Book({ 
            title: req.body.title,
            author: req.body.author,
            pages: req.body.pages,
            isbn: req.body.isbn,
            owner: req.user.userId
        });

        await book.save();
        
        res.status(201).json({ book });
    } catch (e) {
        res.status(500).json({ 
            message: e.message,
            error: e.message});
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        res.json(deletedBook);
    } catch (e) {
        res.status(500).json({ message: "Something went wrong, try again" });
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const book = new Book({ 
            title: req.body.title,
            author: req.body.author,
            pages: req.body.pages,
            isbn: req.body.isbn
        });
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, book, {new: true});
        res.json({message: "Book is updated", updatedBook});
    } catch (e) {
        res.status(500).json({ message: "Something went wrong, try again" });
    }
});

router.get("/", auth, async (req, res) => {
    try {
        const books = await Book.find({ owner: req.user.userId });
        res.json(books);
    } catch (e) {
        res.status(500).json({ message: "Something went wrong, try again" });
    }
});

router.get("/:id", auth, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        res.json(book);
    } catch (e) {
        res.status(500).json({ message: "Something went wrong, try again" });
    }
});


module.exports = router;