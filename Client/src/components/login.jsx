import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/state"; // Adapte le chemin selon ton projet
import { Link } from "react-router-dom";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Connexion réussie !");
        dispatch(setUser({ token: data.token, userInfo: data.user || {} }));
        navigate("/Acceuil");
      } else {
        setErrorMessage(data.message || "Échec de la connexion");
      }
    } catch (err) {
      setErrorMessage("Une erreur est survenue lors de la connexion.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex w-full flex-col items-center justify-center bg-gray-100 px-4 text-gray-600">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-xl shadow-md w-full max-w-md space-y-6"
      >
        <p className="text-center text-sm text-gray-500 tracking-wide">
          Bienvenue dans {" "}
          <span className="font-bold text-green-600 text-lg">Test Cms</span> By{" "}
          <span className="font-bold text-blue-700 text-lg">Hani</span>
        </p>

        <h1 className="text-2xl font-bold text-center text-gray-700">
          Connexion
        </h1>

        {errorMessage && (
          <div className="text-red-600 text-center mb-4">
            <p>{errorMessage}</p>
          </div>
        )}

        <input
          type="email"
          placeholder="Adresse e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition font-semibold"
        >
          Se connecter
        </button>

        <p className="text-center text-sm text-gray-500">
          Vous n'avez pas de compte ?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Créez un compte
          </Link>
        </p>
      </form>
    </div>
  );
}
