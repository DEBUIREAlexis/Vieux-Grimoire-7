const { error, log } = require("console");
const Book = require("../models/Book");
const fs = require("fs");

exports.createBook = (req, res, next) => {
  try {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    });

    book
      .save()
      .then(() => {
        res.status(201).json({ message: "Objet enregistré !" });
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Non-autorisé" });
      } else {
        const oldfilename = book.imageUrl.split("/images/")[1];
        if (oldfilename !== undefined && book.filename !== undefined) {
          fs.unlink(`images/${oldfilename}`, (err) => {
            if (err) {
              console.log(err);
            }
          });
        }
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((Book) => {
      if (Book.userId != req.auth.userId) {
        res.status(401).json({ message: "Non-autorisé" });
      } else {
        const filename = Book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.getBestratingBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      books.sort((a, b) => (a.averageRating < b.averageRating ? 1 : -1));
      res.status(200).json(books.slice(0, 3));
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.createRatingBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      let totalScore = 0;

      console.log(book);
      if (
        book.ratings.find((rating) => rating.userId === req.auth.userId) ===
        undefined
      ) {
        book.ratings.push({ userId: req.auth.userId, grade: req.body.rating });

        book.ratings.map((rating) => {
          console.log(totalScore);
          totalScore = totalScore + rating.grade;
        });
        totalScore = totalScore / book.ratings.length;
        console.log("avg: " + totalScore);
        book.averageRating = totalScore;
        console.log("True" + book.averageRating);
        book
          .save()
          .then(() => res.status(200).json(book))
          .catch((error) => res.status(401).json({ error }));
        console.log(book.ratings);
        console.log(totalScore);
      } else {
        res.status(403).json(book);
      }
    })
    .catch((error) => res.status(400).json({ error }));
};
