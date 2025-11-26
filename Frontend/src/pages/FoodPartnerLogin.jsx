import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthPratnerContext } from '../Context/PartnerContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FoodPartnerLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {partner, setPartner} = useContext(AuthPratnerContext);
    const navigate = useNavigate();

    const submitHandeler =async (e)=>{
        e.preventDefault();
        const partnerLogin = {
            email : email,
            password:password
        }
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/food-partner/login`, partnerLogin, {
            withCredentials : true
        });
        if(response.status === 200){
            const data = response.data;
            console.log(data.token);
            setPartner(data.foodpartner);
            localStorage.setItem('token', data.token);
            navigate('/createFood');
        }

        setEmail('');
        setPassword('');
    }
  return (
   <div>
            <div className='w-full h-screen'>
                <div className='w-full h-screen'>
                    <img className='w-full h-full object-cover brightness-50 contrast-100' src="https://images.unsplash.com/photo-1549831933-17b6be99565e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZCUyMGxhbmRpbmclMjBwYWdlJTIwM2R8ZW58MHx8MHx8fDA%3D" alt="" />
                    <div className='absolute top-1/5 w-full text-white p-5'>
                        <h1 className='text-4xl font-bold text-center'>Welcome Back</h1>
                        <div className='mt-10'>
                            <form onSubmit={((e) => {
                                submitHandeler(e)
                            })}>
                                <h1 className='text-2xl font-semibold mt-3'>Email</h1>
                                <input
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                    }}
                                    required
                                    value={email}
                                    placeholder='example@g.com'
                                    type="email"
                                    className='text-2xl p-2 outline-none mt-1 bg-[#ccc] text-black w-full py-2 rounded-md' />
                                <h1 className='text-2xl font-semibold mt-3'>Password</h1>
                                <input
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                    }}
                                    required
                                    value={password}
                                    placeholder='***********'
                                    type="password"
                                    className='text-2xl p-2 outline-none mt-1 bg-[#ccc] text-black w-full py-2 rounded-md' />
                                <button className='w-full py-2 border-none bg-red-600 font-bold mt-5 text-2xl rounded-sm'>Login</button>
                            </form>
                        </div>
                        <h4 className='text-md font-semibold mt-2'>Not yet Account? <Link to={'/food-partner/register'} className='text-blue-400'>Register</Link></h4>
                    </div>
                    <div className='w-full absolute bottom-4 p-4'>
                        <p className='text-white text-md tracking-tighter'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, odio! Pariatur commodi placeat necessitatibus earum ipsa id recusandae et odit.</p>
                    </div>
                </div>
            </div>
            <i className="text-white text-5xl ri-restaurant-2-fill absolute top-4 right-4"></i>
        </div>
  )
}

export default FoodPartnerLogin
