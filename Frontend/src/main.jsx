import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './style.css'
import { BrowserRouter } from 'react-router-dom'
import UserContext from './context/UserContext.jsx'
import CaptainContext from './context/CaptainContext.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CaptainContext>
    <UserContext>
       <BrowserRouter>
        <App />
    </BrowserRouter>
    </UserContext>
    </CaptainContext>
   
  </StrictMode>,
)
