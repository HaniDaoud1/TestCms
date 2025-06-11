import { useState, useRef } from "react";
import { 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Avatar
} from "@mui/material";
import { 
  CloudUpload, 
  Close, 
  CheckCircle,
  Image as ImageIcon
} from "@mui/icons-material";
import { styled } from '@mui/material/styles';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function AddProductForm() {

  const user = useSelector((state) => state.user);
  const navigate=useNavigate();

  const [product, setProduct] = useState({
    title: "",
    description: "",
    image: null,
    imageFile: null,
  });
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null
  });
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setProduct(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setStatus({
          ...status,
          error: "La taille de l'image ne doit pas dépasser 5MB"
        });
        return;
      }
      setProduct(prev => ({
        ...prev,
        image: URL.createObjectURL(file),
        imageFile: file,
      }));
      setStatus({...status, error: null});
    }
  };

  const handleRemoveImage = () => {
    setProduct(prev => ({
      ...prev,
      image: null,
      imageFile: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("description", product.description);
    formData.append("date", new Date().toISOString());
    formData.append("username", user?.userInfo?.username || "invité");
    formData.append("userpicture", user?.userInfo?.picturePath || "");
    
    if (product.imageFile) {
      formData.append("picture", product.imageFile);
    }

    try {
      const response = await fetch("https://testcms-wd1h.onrender.com/article/create", {
        method: "POST",
        headers:{ "Authorization": `Bearer ${user.token}`},
        body: formData,
      });

      if (!response.ok) {
        const errorResult = await response.json().catch(() => ({ 
          message: "Une erreur est survenue" 
        }));
        throw new Error(errorResult.message);
      }

      const result = await response.json();
      setStatus({ loading: false, success: true, error: null });
      
      // Reset form
      setProduct({
        title: "",
        description: "",
        image: null,
        imageFile: null,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: false }));
      }, 5000);
      // Redirection après un délai
    setTimeout(() => navigate('/Acceuil'), 2000);

    } catch (error) {
      console.error("Erreur:", error);
      setStatus({
        loading: false,
        success: false,
        error: error.message || "Erreur lors de l'ajout de l'article"
      });
    }
  };

  return (
    <> <Navbar />
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#E5E7EB',
        p: 2
      }}
    >
      <Card sx={{ 
        maxWidth: 500, 
        width: '100%',
        boxShadow: 3,
        borderRadius: 2,
        bgcolor:'#E5E7EB'
      }}>
        <CardContent>
          <Typography 
            variant="h5" 
            textAlign="center" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.main',
              mb: 3
            }}
          >
            Ajouter un Nouvel Article
          </Typography>

          {status.error && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              action={
                <IconButton
                  size="small"
                  onClick={() => setStatus({...status, error: null})}
                >
                  <Close fontSize="small" />
                </IconButton>
              }
            >
              {status.error}
            </Alert>
          )}

          {status.success && (
            <Alert 
              severity="success" 
              sx={{ mb: 2 }}
              icon={<CheckCircle fontSize="inherit" />}
            >
              Article ajouté avec succès!
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Titre de l'article"
              name="title"
              value={product.title}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={product.description}
              onChange={handleChange}
              margin="normal"
              required
              rows={4}
              multiline
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <Box sx={{ mb: 2 }}>
              <Button
                fullWidth
                component="label"
                variant="outlined"
                color="primary"
                startIcon={<CloudUpload />}
                sx={{ py: 1.5 }}
              >
                Télécharger une image
                <VisuallyHiddenInput 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  ref={fileInputRef}
                />
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Formats acceptés: JPG, PNG (Max. 5MB)
              </Typography>
            </Box>

            {product.image && (
              <Box sx={{ 
                position: 'relative',
                mb: 2,
                borderRadius: 1,
                overflow: 'hidden',
                height: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.100'
              }}>
                <img 
                  src={product.image} 
                  alt="Aperçu" 
                  style={{ 
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain'
                  }} 
                />
                <IconButton
                  onClick={handleRemoveImage}
                  sx={{ 
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'background.paper',
                    '&:hover': {
                      bgcolor: 'grey.300'
                    }
                  }}
                >
                  <Close />
                </IconButton>
              </Box>
            )}

            {!product.image && (
              <Box 
                sx={{ 
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  mb: 2
                }}
              >
                <Avatar sx={{ 
                  width: 60, 
                  height: 60,
                  bgcolor: 'grey.300'
                }}>
                  <ImageIcon sx={{ fontSize: 30, color: 'grey.500' }} />
                </Avatar>
              </Box>
            )}

            <Button 
              fullWidth 
              type="submit" 
              variant="contained" 
              color="primary" 
              size="large"
              disabled={status.loading}
              sx={{ 
                mt: 1,
                py: 1.5,
                fontWeight: 'bold'
              }}
            >
              {status.loading ? (
                <>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  En cours...
                </>
              ) : (
                'Publier l\'article'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
    <Footer/></>
  );
}

export default AddProductForm;