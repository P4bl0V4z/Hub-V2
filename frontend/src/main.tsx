
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Using direct Leaflet implementation, not react-leaflet
createRoot(document.getElementById("root")!).render(<App />);
