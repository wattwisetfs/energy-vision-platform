
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure we're using StrictMode for better development experience
createRoot(document.getElementById("root")!).render(<App />);
