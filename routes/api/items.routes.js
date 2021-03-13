const express = require("express");
const uuid = require("uuid");
const items = require("../../storage");

const router = express.Router();

// Get all items.
router.get("/", (req, res) => {
    res.json(items);
});

// Get single item.
router.get("/:id", (req, res) => {
    const found = items.some(item => item.id === parseInt(req.params.id));
    if (found) {
        res.json(items.filter(item => item.id === parseInt(req.params.id)));
    } else {
        res.status(400).json({msg: `No item with id ${req.params.id}`});
    }
});

// Create item.
router.post("/", (req, res) => {
    const newItem = {
        id: uuid.v4(),
        title: req.body.title,
        author: req.body.author,
        pages: req.body.pages,
        isbn: req.body.isbn
    }

    if (!newItem.title || !newItem.author || !newItem.pages || !newItem.isbn) {
        return res.status(400).json({ msg: "Information is not total" });
    }

    items.push(newItem);
    res.send(newItem);
});

// Update item.
router.put("/update/:id", (req, res) => {
    const found = items.some(item => item.id === parseInt(req.params.id));
    if (found) {
        const updItem = req.body;
        items.forEach(item => {
            if (item.id === parseInt(req.params.id)) {
                item.author = updItem.author ? updItem.author : item.author;
                item.title = updItem.title ? updItem.title : item.title;
                item.pages = updItem.pages ? updItem.pages : item.pages;
                item.isbn = updItem.isbn ? updItem.isbn : item.isbn;
                
                res.json({ msg: "Item updated", item });
            }
        });
    } else {
        res.status(400).json({msg: `No item with id ${req.params.id}`});
    }
});

// Delete item.
router.delete("/delete/:id", (req, res) => {
    const found = items.some(item => item.id === parseInt(req.params.id));
    items.forEach((item, index) => {
        if (item.id === parseInt(req.params.id)) {
            items.splice(index, 1);
        };
    });
    if (!found) {
        res.status(400).json({msg: `No item with id ${req.params.id}`});
    } else {
        res.json({message: `"${req.params.title}" deleted`});
    }
});

module.exports = router;