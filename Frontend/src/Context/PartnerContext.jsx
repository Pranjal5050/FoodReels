import React, { createContext, useState } from 'react'
export const AuthPratnerContext = createContext();

const PartnerContext = ({ children }) => {
    const [partner, setPartner] = useState({
        businessname: '',
        contactname: '',
        phone: '',
        email: '',
        password: '',
        address: ''

    })
    return (
        <div>
            <AuthPratnerContext.Provider value={{partner, setPartner}}>
                {children}
            </AuthPratnerContext.Provider>
        </div>
    )
}

export default PartnerContext
