import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Divider } from '@mui/material';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await axios.post('/api/auth/login', { email, password }, { withCredentials: true });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      await axios.post('/api/auth/google', { credential: credentialResponse.credential }, { withCredentials: true });
      navigate('/');
    } catch (err) {
      setError('Error al iniciar sesión con Google');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h5" gutterBottom>Iniciar Sesión</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField fullWidth margin="normal" label="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} />
      <TextField fullWidth margin="normal" type="password" label="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
      <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>Ingresar</Button>
      <Divider sx={{ my: 2 }}>O</Divider>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => setError('Error con la autenticación de Google')}
      />
    </Box>
  );
}
