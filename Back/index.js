const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const SingUpHanderler = require("./RouteHandler/SingUpHandeler");
const AdminLoginHandeler = require("./RouteHandler/AdminLoginHandeler");
const UploadFileUser = require("./RouteHandler/UploadFileUser");
const AuthHandler = require("./RouteHandler/AuthHandler");
var cors = require("cors");
const app = express();
const path = require("path");
dotenv.config();
const port = 5000;
// database connection
mongoose.set('strictQuery', false);
mongoose
  .connect(
    `mongodb+srv://rimu:islam@cluster0.ylmgo4e.mongodb.net/CSE?appName=Cluster0`
  )
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));
app.use(express.json());
app.use(cors());
app.use("/Singup", SingUpHanderler);
app.use("/SingUpAdmin", AdminLoginHandeler);
app.use("/Upload", UploadFileUser);
app.use("/Auth", AuthHandler);
app.use("/uploads", express.static(path.join(__dirname, "RouteHandler/uploads")));
app.use(express.static("Uploads"));
app.use(fileUpload);
// default error handler
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({
    error: err,
  });
};
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
