import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import Footer from './Footer';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';

function Acceuil() {
    const user = useSelector((state) => state.user);

    const [result,setResult]=useState();

  
    const navigate=useNavigate();
  
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
        <Navbar/>
            {result ? (
              <div className="p-4 sm:p-6 lg:p-16  bg-gray-300">
  <p className="text-4xl font-bold mb-6 text-center">Que proposons-nous ?</p>

  {result.map((offre, index) => (
    <React.Fragment key={`offre-${offre._id}`}>
      <div className="mb-14 flex flex-col sm:flex-row sm:items-start gap-x-8">
        <div className="sm:w-1/2">
          <p className="text-2xl font-bold">{offre.title}</p>
          <p className="mt-2 text-gray-700">{offre.description}</p>
          <button
            onClick={() => navigate(`/Articles/${offre._id}`)}
            className="mt-4 px-5 py-2 border-2 mb-5 border-gray-800 text-gray-800 font-semibold rounded-lg transition-all duration-300 hover:bg-gray-800 hover:text-white hover:scale-105"
          >
            Explorer
          </button>
        </div>

        <div className="relative w-full m-auto sm:w-1/2 max-w-lg">
          <div className="absolute -bottom-3 -right-3 w-full h-full bg-black rounded-2xl"></div>
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative h-72 w-full object-cover rounded-2xl shadow-xl transition-transform duration-300 ease-out hover:scale-105 hover:rotate-1 hover:shadow-2xl"
            src={offre.picturePaths}
            alt="Image"
          />
        </div>
      </div>
      <hr className="w-72 m-auto mb-10 font-bold" />
    </React.Fragment>
  ))}

 
     
    
    </div>
            ) : (
                <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
            )}
            <Footer/>
        </>
    );
}

export default Acceuil;
