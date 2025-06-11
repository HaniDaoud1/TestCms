import { useState } from 'react';
import { FiPlus, FiLogOut, FiUser } from 'react-icons/fi';
import { logout } from '../store/state';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Navbar() {
  const [isHoverAdd, setIsHoverAdd] = useState(false);
  const [isHoverLogout, setIsHoverLogout] = useState(false);
  const [isClickedUser, setIsClickedUser]=useState(false);
  const navigate= useNavigate();
 const user = useSelector((state) => state.user);

  return (
    <div className='h-20 w-full bg-gray-800 text-white shadow-lg font-bold'>
      <div className='container mx-auto h-full px-4 flex items-center justify-between'>
        {/* Logo */}
        <div className='flex items-center space-x-2 hover:cursor-pointer' 
        onClick={()=>{navigate('/Acceuil')}}>
          <div className='w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center'>
            <span className='font-bold text-white'>TC</span>
          </div>
          <span className='text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent'>
            Test CMS
          </span>
        </div>

        <div className='flex items-center space-x-6'>
          {/* Bouton Ajouter un Article */}
          <button
          onClick={()=>navigate('/AjoutArticle')}
            onMouseEnter={() => setIsHoverAdd(true)}
            onMouseLeave={() => setIsHoverAdd(false)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
              isHoverAdd ? 'bg-indigo-600 shadow-lg' : 'bg-indigo-500 shadow-md'
            }`}
          >
            <FiPlus className={`transition-transform duration-300 ${isHoverAdd ? 'rotate-90' : ''}`} />
            <span className='text-sm w-30'>Ajouter un Article</span>
          </button>

          {/* Profile et Déconnexion */}
          <div className='flex items-center space-x-4'>
            <div className='relative group'>
              <div onClick={() => setIsClickedUser(!isClickedUser)} className='w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-500 transition'>
                <FiUser className='text-white' />
              </div>
              <div className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10 ${isClickedUser ? '': 'hidden'}  `}>
                <div className='px-4 py-3 border-b border-gray-200'>
                  <p className='text-sm text-gray-800'>Connecté en tant que</p>
                  <p className='text-sm font-medium text-gray-900'>{user?.userInfo?.username}</p>
                </div>
                <button
                onClick={()=>{logout();
                    navigate("/")
                }}
                  onMouseEnter={() => setIsHoverLogout(true)}
                  onMouseLeave={() => setIsHoverLogout(false)}
                  className={`w-full flex items-center space-x-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition ${
                    isHoverLogout ? 'text-red-500' : ''
                  }`}
                >
                  <FiLogOut className={`transition-transform duration-200 ${isHoverLogout ? 'scale-110' : ''}`} />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;