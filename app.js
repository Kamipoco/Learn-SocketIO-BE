//Package
const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

//Khi dùng socketio thì thay server.listen và mở cors cho cổng client có thể giao tiếp
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

require("dotenv").config("");
const PORT = process.env.PORT || 9009;
const HOST = process.env.HOST;
const NODE_ENV = process.env.NODE_ENV.toString();

//Handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log("Shutting down due to Uncaught Exceptions");

  process.exit(1);
});

//Security
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
//Đọc dữ liệu kiểu json khi client gửi lên
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Chat App");
});

//=====================SOCKETIO============================
io.on("connection", (socket) => {
  //Thông báo mỗi khi có ai đó online
  console.log("A user is connected!");

  //Lắng nghe sự kiện nhập tên và gửi message
  socket.on("message", ({ name, message }) => {
    //Phát ra sự kiện gửi data về cho client hiển thị name và message
    io.emit("getData", { name, message });
  });
});

//Lắng nghe port
http.listen(PORT, () => {
  console.log(`Server is running on ${HOST}${PORT} in ${NODE_ENV} mode`);
});

//Xử lý lỗi khi MONGODB_URL bị sai
//Handle Unhandled Promise rejections
// process.on("unhandledRejection", (err) => {
//   console.log(`ERROR: ${err.stack}`);
//   console.log("Shutting down the server due to Unhandled Promise rejection");
//   server.close(() => {
//     process.exit(1);
//   });
// });
