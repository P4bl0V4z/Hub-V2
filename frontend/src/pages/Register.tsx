import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';

export default function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post('/api/auth/register', { email, name, password }, { withCredentials: true });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h5" gutterBottom>Registrarse</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField fullWidth margin="normal" label="Nombre completo" value={name} onChange={e => setName(e.target.value)} />
      <TextField fullWidth margin="normal" label="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} />
      <TextField fullWidth margin="normal" type="password" label="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
      <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleRegister}>Registrarse</Button>
    </Box>
  );
}
