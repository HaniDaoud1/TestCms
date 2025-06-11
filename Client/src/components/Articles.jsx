import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';
import { ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Articles() {
    const user = useSelector((state) => state.user);
  const navigate=useNavigate();
  const { id } = useParams();
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);

   useEffect(()=>{
        getProducts();
      },[])
      const getProducts = async ()=>{
  
        try {
          const response=await fetch('https://testcms-wd1h.onrender.com/article/allproducts', {
            method: "GET",
            headers: { "Content-Type": "application/json",
              "Authorization": `Bearer ${user.token}`
             },
                
          });
          if (!response.ok) {
            const errorResult = await response.json().catch(() => ({ message: "Unknown error" }));
            alert("Erreur: " + errorResult.message || "Échec de la récupération des produits.");
            return;
          }
    
          const result = await response.json();
          setResult(result);
          setLoading(false);
        } catch (error) {
          console.error("Erreur:", error);
    
        }
      }

     const deleteProduct = async () => {
  // Confirmation avant suppression
  const shouldDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.");
  if (!shouldDelete) return;

  try {

    const response = await fetch(`https://testcms-wd1h.onrender.com/article/deleteproduct/${id}`, {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}` // Sécurité ajoutée
      },    
    });

    if (!response.ok) {
      const errorResult = await response.json().catch(() => ({ 
        message: "Échec de la suppression (erreur serveur)" 
      }));
      throw new Error(errorResult.message || "Erreur inconnue");
    }
     

    // Feedback visuel de succès
    toast.success("Article supprimé avec succès!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

   // Redirection après un délai
    setTimeout(() => navigate('/Acceuil'), 1500);

  } catch (error) {
    console.error("Erreur:", error);
    
    

    // Message d'erreur détaillé
    toast.error(`Échec de la suppression: ${error.message}`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }
};

  const article = result.find(o => o._id === id);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-xl text-gray-600">Article non trouvé</p>
            <button 
              onClick={() => window.history.back()} 
              className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center mx-auto"
            >
              <ArrowLeft className="mr-2" /> Retour
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
  <Navbar />
  
  <motion.main
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="flex-grow"
  >
    {/* Hero Section améliorée */}
    <div className="relative h-[32rem] w-full overflow-hidden">
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
        className="w-full h-full relative"
      >
        <img
          src={article.picturePaths}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
      </motion.div>
      
      <div className="absolute inset-0 flex items-end pb-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
          >
            {article.title}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center space-x-4"
          >
            <span className="text-gray-300">{new Date(article.createdAt).toLocaleDateString()}</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-300">{article.readTime} min read</span>
          </motion.div>
        </div>
      </div>
    </div>

    {/* Contenu amélioré */}
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 md:p-12"
      >
        <div className="prose prose-lg max-w-none">
          <div className="flex items-center mb-8">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="px-4 text-gray-500 font-medium">Article</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>
          
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            {article.description}
          </p>
          
          {/* Section auteur */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex items-center">
            <div className="mr-4">
              <div className="w-14 h-14 sm:h-20 sm:w-20 content-center rounded-full bg-gray-200 overflow-hidden">
                <img src={article.userpicture} alt="Image" />
              </div>
            </div>
            <div>
              <h4 className="font-medium sm:text-xl text-gray-900">Auteur : {article.username}</h4>
              <p className="text-gray-500">Publié le {new Date(article.createdAt).toISOString().split('T')[0]}</p>
            </div>
          </div>
        </div>
<motion.button 
onClick={deleteProduct}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 mt-10 w-full max-w-xs mx-auto flex items-center justify-center space-x-2"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
  <span>Supprimer l'Article</span>
</motion.button>
      </motion.div>
    </div>
  </motion.main>


   
      <Footer />
    </div>
  );
}

export default Articles;