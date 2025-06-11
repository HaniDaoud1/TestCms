import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../store/state"; // ajustez le chemin selon votre projet

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    picture: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image")) {
        setFormData({ ...formData, picture: file });
        setImagePreview(URL.createObjectURL(file));
      } else {
        setErrorMessage("Veuillez télécharger un fichier image.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    if (formData.picture) {
      data.append("picture", formData.picture);
    }

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        body: data,
      });

      const response = await res.json();

      if (res.ok) {
        alert("Utilisateur enregistré !");
        dispatch(setUser({
          token: response.token,
          userInfo: response.user || {},
        }));
        navigate("/Acceuil");
      } else {
        setErrorMessage(response.error || "Erreur lors de l'inscription");
      }
    } catch (error) {
      setErrorMessage("Une erreur est survenue, veuillez réessayer.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-white text-gray-600 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md space-y-6">
        <h2 className="text-3xl font-semibold text-center text-gray-700">
          Créer un compte
        </h2>

        {errorMessage && (
          <div className="text-red-600 text-center mb-4">
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Nom d'utilisateur"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Adresse e-mail"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label
            htmlFor="picture"
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-500 bg-white cursor-pointer hover:bg-gray-50 text-center"
          >
            {formData.picture ? formData.picture.name : "Choisir une image"}
          </label>
          <input
            id="picture"
            type="file"
            name="picture"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {imagePreview && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500 mb-1">Aperçu de l'image :</p>
              <img
                src={imagePreview}
                alt="Aperçu"
                className="object-cover rounded-full mx-auto h-48 w-48 shadow"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setFormData({ ...formData, picture: null });
                }}
                className="mt-2 text-red-500 hover:underline text-sm"
              >
                Supprimer l'image
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition font-semibold"
          >
            S'inscrire
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Vous avez déjà un compte ?{" "}
          <a href="/" className="text-blue-600 hover:underline font-medium">
            Connectez-vous
          </a>
        </p>
      </div>
    </div>
  );
}
