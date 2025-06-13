import { motion } from "framer-motion";
import { Toaster } from 'react-hot-toast';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import {ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

function Footer() {
  const navigate = useNavigate();
  const [result,setResult]=useState();
        
  const user = useSelector((state) => state.user);

   useEffect(()=>{
        getProducts();
      },[])
      const getProducts = async ()=>{
  
        try {
          const response=await fetch('https://testcms-wd1h.onrender.com/article/allproducts', {
            method: "GET",
            headers: { "Content-Type": "application/json" ,
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
        } catch (error) {
          console.error("Erreur:", error);
    
        }
      }
      

  return (
    <>
      <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-6 py-12 ">
          {/* Hero Illustration */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center mb-16"
          >
            <div className="relative w-full max-w-4xl h-64 sm:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img
                className="w-full h-full object-cover"
                src="https://periodicodelomasvendido.com/wp-content/uploads/2023/12/Las-mejores-marcas-de-computadoras-en-el-mercado-800x533.jpg"
                alt="Global trade illustration"
              />
              <div className="absolute inset-0  flex items-end p-6">
                <h2 className="text-3xl font-bold text-gray-400">
                  Votre partenaire 
                </h2>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
            

            {/* Articles */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-6 text-indigo-300">Articles récents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result?.map((article, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-gray-800/50 rounded-xl overflow-hidden hover:bg-gray-800/70 transition-all cursor-pointer"
                    onClick={() => navigate(`/articles/${article._id}`)}
                  >
                    <div className="p-5">
                      <h4 className="font-semibold text-lg mb-2">{article.title}</h4>
                      <p className="text-gray-400 text-sm line-clamp-2">{article.description}</p>
                      <div className="mt-4 flex items-center text-indigo-400 text-sm font-medium">
                        Lire l'article
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="md:col-span-2 flex flex-col items-center justify-center w-full px-4 py-12">
  <h3 className="text-2xl font-bold mb-4 text-indigo-300">Newsletter</h3>
  <p className="text-gray-400 mb-6 text-center max-w-md">
    Abonnez-vous pour recevoir les dernières actualités et analyses.
  </p>

  <form className="w-full max-w-md space-y-4">
    <input
      type="email"
      placeholder="Votre email"
      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-indigo-500 focus:outline-none text-white"
    />
    <button
      type="submit"
      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity"
    >
      S'abonner
    </button>
  </form>

  <div className="mt-8 text-center">
    <h4 className="font-medium mb-3 text-white">Suivez-nous</h4>
    <div className="flex space-x-4 justify-center">
      {[
        { icon: <FaFacebookF />, link: "https://facebook.com" },
        { icon: <FaTwitter />, link: "https://twitter.com" },
        { icon: <FaInstagram />, link: "https://instagram.com" },
        { icon: <FaLinkedinIn />, link: "https://linkedin.com" },
      ].map((social, index) => (
        <motion.a
          key={index}
          href={social.link}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -3 }}
          className="w-10 h-10 text-white rounded-full bg-gray-700 flex items-center justify-center hover:bg-indigo-600 transition-colors"
        >
          {social.icon}
        </motion.a>
      ))}
    </div>
  </div>
</div>
</div>


          {/* Divider */}
          <div className="border-t border-gray-800 my-10"></div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="font-bold text-white">TC</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Test Cms
              </span>
            </div>
            <p className="text-gray-400">
              © {new Date().getFullYear()} Test Cms Inc. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
      <Toaster position="bottom-right" />
    </>
  )
}

export default Footer;