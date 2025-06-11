const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String, // Modifié pour être un nombre
      required: true,
    },
    description: {
      type: String, // Modifié pour être un nombre
      required: true,
    },
    username: {
      type: String, // Modifié pour être un nombre
    },
    userpicture: {
      type: String, // Modifié pour être un nombre
    },
    date: {
      type: Date,
    },
    picturePaths: {
      type: [String],
      default: [], // Tableau de chemins d'images
    },
    userPicturePath: String,
  },
  { timestamps: true } // Ajouter les champs createdAt et updatedAt
);

module.exports = mongoose.model("Articles", postSchema);
