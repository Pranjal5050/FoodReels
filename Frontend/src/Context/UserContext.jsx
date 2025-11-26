import React, { createContext, useState } from 'react'
export const AuthContext = createContext();

const UserAuth = ({children}) => {
const [user, setUserData]= useState({
  fullname : {
    firstname : '',
    lastname : ''
  },
  email : '',
})
  return (
    <div>
      <AuthContext.Provider value={{user, setUserData}}>
        {children}
      </AuthContext.Provider>
    </div>
  )
}

export default UserAuth
