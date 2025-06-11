import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './components/regester';
import LoginPage from './components/login';
import Acceuil from './components/Acceuil';
import Articles from './components/Articles';
import AddProductForm from './components/AjoutArticle';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/Acceuil" element={<Acceuil />} />
        <Route path="/Articles/:id" element={<Articles />} />
        <Route path="/AjoutArticle" element={<AddProductForm />} />

      </Routes>
    </Router>
  );
}
export default App
