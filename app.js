const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
//const exphbs = require("express-handlebars");
//const items = require("./storage");

const app = express();

// Body parser middleware.
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: false }));


app.use("/api/auth", require("./routes/api/auth.routes"));
app.use("/api/book", require("./routes/api/book.routes"));

/*
// Handlebars middleware.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.render("index", {
        title: "Book List",
        items
    });
});

app.use("/api/members", require("./routes/api/items.routes"));
*/

const port = process.env.PORT || 5000;

async function startServer() {
    try {
        await mongoose.connect(config.get("mongoUri"), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        app.listen(port, () => console.log("Listening on " + port));

    } catch (e) {
        console.log("Server error", e.message);
        process.exit(1);
    }
}

startServer();