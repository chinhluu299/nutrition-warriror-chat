const ChatRouter = require("./src/routes/chat_router.js");
const BroadRouter = require("./src/routes/broadcast_router");
const StoryRouter = require("./src/routes/story_router");
const UserRouter = require("./src/routes/user_router.js");
const dbConfig = require("./src/config/db.js");

// const ImageRouter = require("./src/routes/image_router.js");
const { GridFSBucket } = require("mongodb");

const express = require("express");
const router = express.Router();
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const User = require("./src/models/User");
const Chat = require("./src/models/Chat");

const rabbitmq = require("./src/utils/broker.js");
const { CreateChannel, SubscribeMessage } = require("./src/utils/broker.js");
const upload = require("./src/services/multer.js");

require("dotenv/config");

const port = process.env.PORT;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to DB");
  }
);
const conn = mongoose.connection;
let gfs;

conn.once("open", () => {
  gfs = new GridFSBucket(conn.db, {
    bucketName: dbConfig.imgBucket,
  });
});

app.use("/api/v1/chat", ChatRouter);
app.use("/api/v1/broadcast", BroadRouter);
app.use("/api/v1/story", StoryRouter);
app.use("/api/v1/user", UserRouter);
// app.use("/api/v1/image/download", ImageRouter)

/** Socket Declarations */

var clients = []; //connected clients
router.get("/:filename", (req, res) => {
  try {
    console.log("get image");
    const { filename } = req.params;
    let downloadStream = gfs.openDownloadStreamByName(filename);

    downloadStream.on("data", function (data) {
      return res.status(200).write(data);
    });

    downloadStream.on("error", function (err) {
      return res.status(404).send({ message: "Cannot download the Image! " + err });
    });

    downloadStream.on("end", () => {
      return res.end();
    });
  } catch (error) {
    return res.status(500).write(error);
  }
  
});
app.use("/api/v1/image", router);

io.on("connection", (socket) => {
  console.log("New User Connected");
  socket.on("storeClientInfo", function (data) {
    console.log(data.customId + " Connected");
    //store the new client
    var clientInfo = new Object();
    clientInfo.customId = data.customId;
    clientInfo.clientId = socket.id;
    clients.push(clientInfo);

    //update the active status
    const res = User.updateOne({ id: data.customId }, { isActive: true });
    res.exec().then(() => {
      console.log("Activated " + data.customId);

      //Notify others
      socket.broadcast.emit("update", "Updated");
      console.log("emmited");
    });
  });

  socket.on("disconnect", function (data) {
    for (var i = 0, len = clients.length; i < len; ++i) {
      var c = clients[i];
      if (c.clientId == socket.id) {
        //remove the client
        clients.splice(i, 1);
        console.log(c.customId + " Disconnected");

        //update the active status
        const res = User.updateOne({ id: c.customId }, { isActive: false });
        res.exec().then((data) => {
          console.log("Deactivated " + c.customId);

          //notify others
          socket.broadcast.emit("update", "Updated");
        });
        break;
      }
    }
  });
});

//Messages Socket
const chatSocket = io.of("/chatsocket");
chatSocket.on("connection", function (socket) {
  //On new message
  socket.on("newMessage", (data) => {
    //Notify the room
    socket.broadcast.emit("incommingMessage", "reload");
  });
});

async function initRabbitMQ() {
  try {
    const channel = await rabbitmq.CreateChannel();
    await rabbitmq.SubscribeMessage(channel);
  } catch (error) {
    console.error("Error initializing RabbitMQ:", error);
  }
}

initRabbitMQ();

//Let the server to listen
server.listen(port, () => console.log(`Listening on port ${port}`));
