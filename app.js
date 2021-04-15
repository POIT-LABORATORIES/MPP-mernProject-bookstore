const express = require("express");
const app = express();
const mongoose = require("mongoose");
const config = require("config");
const server = require("http").createServer(app); //
const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "DELETE", "PUT"]
    }
  }); 

// Body parser middleware.
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: false }));

//app.use("/api/auth", require("./routes/api/auth.routes"));
//app.use("/api/book", require("./routes/api/book.routes"));

const port = process.env.PORT || 5000;

const registerBookHandlers = require("./handlers/book.handler");
const registerAuthHandlers = require("./handlers/auth.handler");

io.use((socket, next) => {
  console.log("");
  console.log("Socket.io middleware");
  const token = socket.handshake.auth.token;
  if (token) {
    console.log(token);
  }
  next();
});

const onConnection = (socket) => {
  registerBookHandlers(io, socket);
  registerAuthHandlers(io, socket);

  socket.on("break", (reason) => { //DELETE THIS 
    console.log(reason.message);
  });

  socket.on("disconnect", (reason) => {
    console.log(reason);
  });
}

io.on("connection", onConnection);

async function startServer() {
    try {
        await mongoose.connect(config.get("mongoUri"), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        //app.listen(port, () => console.log("Listening on " + port));
        server.listen(port, () => console.log("Listening on " + port));

    } catch (e) {
        console.log("Server error", e.message);
        process.exit(1);
    }
}

startServer();