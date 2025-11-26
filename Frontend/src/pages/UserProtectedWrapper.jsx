import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const UserProtectedWrapper = ({children}) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(()=>{
        if(!token || token === "undefined"){
            navigate('/food-partner/login')
        }
    }, [token])
  return (
    <div>
      {children}
    </div>
  )
}

export default UserProtectedWrapper
