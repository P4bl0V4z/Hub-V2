const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Backend de Hub2.0 funcionando'));
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));