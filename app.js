const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema");

const app = express();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", require("./routes/api/auth.routes"));
app.use("/api/book", require("./routes/api/book.routes"));

app.use("/graphql", graphqlHTTP({
    schema
}));

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