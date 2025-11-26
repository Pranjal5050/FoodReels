import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import 'remixicon/fonts/remixicon.css'
import axios from 'axios'
import { AuthContext } from '../Context/UserContext'
import { useNavigate } from 'react-router-dom'

const UserSignup = () => {
    const [firstname, setfirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const { user, setUserData } = React.useContext(AuthContext);    
    const submitHandeler = async (e) => {
        e.preventDefault()

        const userData = {
            fullname: {
                firstname: firstname,
                lastname: lastname
            },
            email: email,
            password: password
        }
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/user/register`, userData);
        if (response.status === 201) {
            const data = response.data
            setUserData(data.user);
            navigate('/home');
        }

        setfirstname('');
        setLastname('');
        setEmail('');
        setPassword('');

    }

    return (
        <div className='w-full h-screen relative'>
            <div className='w-full h-screen'>
                <img className='w-full h-full object-cover brightness-50 contrast-100' src="https://images.unsplash.com/photo-1549831933-17b6be99565e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZCUyMGxhbmRpbmclMjBwYWdlJTIwM2R8ZW58MHx8MHx8fDA%3D" alt="" />
                <div className='absolute top-1/5 w-full text-white p-5'>
                    <h1 className='text-4xl font-bold text-center'>Create Account</h1>
                    <div className='mt-10'>
                        <form onSubmit={(e) => {
                            submitHandeler(e);
                        }}>
                            <div className='w-full flex gap-10'>
                                <div>
                                    <h1 className='text-2xl font-semibold'>Firstname</h1>
                                    <input
                                    placeholder='John'
                                        value={firstname}
                                        onChange={(e) => {
                                            setfirstname(e.target.value)
                                        }}
                                        type="text"
                                        className='w-35 text-2xl p-2 outline-none mt-1 bg-[#ccc] text-black py-2 rounded-md'
                                    />
                                </div>
                                <div>
                                    <h1 className='text-2xl font-semibold'>Lastname</h1>
                                    <input
                                    placeholder='Doe'
                                        value={lastname}
                                        onChange={(e) => {
                                            setLastname(e.target.value)
                                        }}
                                        type="text"
                                        className='w-35 text-2xl p-2 outline-none mt-1 bg-[#ccc] text-black py-2 rounded-md'
                                    />
                                </div>
                            </div>
                            <h1 className='text-2xl font-semibold mt-3'>Email</h1>
                            <input
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }}
                                type="email"
                                placeholder='example@gmail.com'
                                className='text-2xl p-2 outline-none mt-1 bg-[#ccc] text-black w-full py-2 rounded-md'
                            />
                            <h1 className='text-2xl font-semibold mt-3'>Password</h1>
                            <input
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}
                                type="password"
                                placeholder='********'
                                className='text-2xl p-2 outline-none mt-1 bg-[#ccc] text-black w-full py-2 rounded-md'
                            />
                            <button className='w-full py-2 border-none bg-red-600 font-bold mt-5 text-2xl rounded-sm'>Create Account</button>
                        </form>
                    </div>
                    <h4 className='text-md font-semibold mt-2'>Already have an Account? <Link to={'/user/login'} className='text-blue-400'>Login</Link></h4>
                </div>
                <Link to={'/food-partner/register'} className='w-[70%] p-3 text-lg bg-orange-600 text-white font-bold rounded-r-full absolute bottom-8 left-4'>Register For Food Partner</Link>
            </div>
            <i className="text-white text-5xl ri-restaurant-2-fill absolute top-4 right-4"></i>
        </div>
    )
}

export default UserSignup
