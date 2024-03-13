const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bookRoutes = require("./routes/book.js");
const userRoutes = require("./routes/user.js");

const app = express();
mongoose
  .connect(
    "mongodb+srv://alexisdebuire:5dMMM2uc57hRnWvH@learndatabase.o3hnbuf.mongodb.net/?retryWrites=true&w=majority&appName=LearnDatabase",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connextion à MongoDB réussie !"))
  .catch(() => console.log("Connextion à MongoDB échouée !"));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);

app.use("/images", express.static(path.join(__dirname, "images")));
module.exports = app;
