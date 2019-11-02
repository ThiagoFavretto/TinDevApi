const express = require("express");
const routes = require("./routes");
const mongoose = require("mongoose");
const cors = require("cors");

const httpServer = express();
const server = require("http").Server(httpServer);
const io = require("socket.io")(server);

const connectUsers = {};

io.on("connection", socket => {
  const { user } = socket.handshake.query;

  connectUsers[user] = socket.id;
});

// const connectionString =
//   "mongodb+srv://TinDevCL:cereal0l@tindevcluster-muu7b.mongodb.net/tindevdb?retryWrites=true&w=majority";

mongoose.connect(
  "mongodb+srv://teste:teste@tindevcluster-muu7b.mongodb.net/tindevdb?retryWrites=true&w=majority",
  {
    useNewUrlParser: true
  }
);

mongoose.connection.on("error", function(error) {
  console.error("Database connection error:", error);
});

httpServer.use((req, res, next) => {
  req.io = io;
  req.connectUsers = connectUsers;
  return next();
});

httpServer.use(cors());
httpServer.use(express.json());
httpServer.use(routes);

server.listen(process.env.PORT || 3333);
