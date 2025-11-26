import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'
import UserContext from './Context/UserContext.jsx'
import PartnerContext from './Context/PartnerContext.jsx'

createRoot(document.getElementById('root')).render(
   <PartnerContext>
      <UserContext>
         <App />
      </UserContext>
   </PartnerContext>
)
