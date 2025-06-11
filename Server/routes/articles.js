const express = require("express");
const { cloudinary } = require("../cloudinary");
const Produit = require("../models/Articles");
const { upload } = require("../cloudinary");

const router = express.Router();

// Créer un post
router.post("/create", upload.single("picture"), async (req, res) => {
  try {
    const { title, description, date, username, userpicture } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Missing required fields: title.",
      });
    }

    const picturePaths = [];
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "posts",
      });
      picturePaths.push(result.secure_url);
    }

    const newPost = new Produit({
      title,
      description,
      picturePaths,
      date,
      userpicture,
      username,
    });

    await newPost.save();

    res.status(201).json({
      message: "Produit créé avec succès",
      product: newPost,
    });
  } catch (error) {
    console.error("Error creating post:", error.message);
    res.status(500).json({
      message: "Failed to create post",
      error: error.message,
    });
  }
});

// Récupérer tous les produits
router.get("/allproducts", async (req, res) => {
  try {
    const produits = await Produit.find();
    res.status(200).json(produits);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
});

// Supprimer un produit
router.delete("/deleteproduct/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    if (!_id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID invalide." });
    }

    const post = await Produit.findById(_id);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Aucun post trouvé avec cet ID." });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post supprimé avec succès." });
  } catch (error) {
    console.error("Error deleting post:", error.message);
    res.status(500).json({
      message: "Échec de la suppression du post.",
      error: error.message,
    });
  }
});

module.exports = router;
