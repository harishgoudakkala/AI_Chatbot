import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createTheme, ThemeProvider } from '@mui/material'
import { BrowserRouter as Router } from'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import axios from 'axios'
import { Toaster } from 'react-hot-toast'

axios.defaults.baseURL = 'http://localhost:5000/api/v1'
axios.defaults.withCredentials = true

const styles = createTheme({
  typography:{
    fontFamily: 'Poppins',
    allVariants: {color: 'white'},
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
    <Router>
      <ThemeProvider theme={styles}>
        <Toaster position="top-center"/>
        <App />
      </ThemeProvider>
    </Router>
    </AuthProvider>
  </StrictMode>,
)
