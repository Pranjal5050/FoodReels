import React from 'react'
import AppRouter from './routes/AppRouter'
import {ToasContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div>
      <AppRouter/>
      <ToasContainer position='top-right'/>
    </div>
  )
}

export default App
