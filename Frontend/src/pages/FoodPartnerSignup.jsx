import axios from 'axios';
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthPratnerContext } from '../Context/PartnerContext';

const FoodPartnerSignup = () => {
    const [businessname, setBusinessname] = useState("");
    const [contactname, setContactname] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setaddress] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {partner, setPartner} = useContext(AuthPratnerContext);
    const navigate = useNavigate();

    const submitHandeler = async (e) => {
        e.preventDefault();
        const partner = {
            businessname: businessname,
            contactname: contactname,
            phone: phone,
            email: email,
            address: address,
            password: password
        }
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/food-partner/register`, partner, {
            withCredentials : true
        });
        if(response.status === 201){
            const data = response.data
            setPartner(data.foodpartner);
            localStorage.setItem('token', data.token)
            navigate('/home');
        }

        setBusinessname('');
        setContactname('');
        setPhone('');
        setaddress('');
        setEmail('');
        setPassword('');

    }
    return (
        <div className='w-full h-screen relative'>
            <div className='w-full h-screen'>
                <img className='w-full h-full object-cover brightness-50 contrast-100' src="https://images.unsplash.com/photo-1549831933-17b6be99565e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZCUyMGxhbmRpbmclMjBwYWdlJTIwM2R8ZW58MHx8MHx8fDA%3D" alt="" />
                <div className='absolute top-1/5 w-full text-white p-5'>
                    <h1 className='text-4xl font-bold text-center'>Create Account</h1>
                    <div className='mt-5'>
                        <form onSubmit={(e) => {
                            submitHandeler(e);
                        }}>
                            <h1 className='text-lg font-semibold'>Business Name</h1>
                            <input
                                placeholder='Doe'
                                value={businessname}
                                onChange={(e) => {
                                    setBusinessname(e.target.value)
                                }}
                                type="text"
                                className='w-full text-2xl p-2 outline-none mt-1 bg-[#ccc] text-black py-2 rounded-md'
                            />

                            <div className='flex gap-10 mt-2'>
                                <div>
                                    <h1 className='text-md font-semibold'>Contact Name</h1>
                                    <input
                                        placeholder='Tasty tiles....'
                                        value={contactname}
                                        onChange={(e) => {
                                            setContactname(e.target.value)
                                        }}
                                        type="text"
                                        className='w-38 text-lg p-2 outline-none mt-1 bg-[#ccc] text-black py-2 rounded-md'
                                    />
                                </div>
                                <div>
                                    <h1 className='text-md font-semibold'>Phone</h1>
                                    <input
                                        placeholder='+91 914******23'
                                        value={phone}
                                        onChange={(e) => {
                                            setPhone(e.target.value)
                                        }}
                                        type="number"
                                        className='w-38 text-lg p-2 outline-none mt-1 bg-[#ccc] text-black py-2 rounded-md'
                                    />
                                </div>
                            </div>

                            <h1 className='text-lg font-semibold mt-3'>Email</h1>
                            <input
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }}
                                type="email"
                                placeholder='example@gmail.com'
                                className='text-lg p-2 outline-none mt-1 bg-[#ccc] text-black w-full py-2 rounded-md'
                            />
                            <h1 className='text-lg font-semibold mt-3'>Password</h1>
                            <input
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}
                                type="password"
                                placeholder='********'
                                className='text-lg p-2 outline-none mt-1 bg-[#ccc] text-black w-full py-2 rounded-md'
                            />
                            <h1 className='text-lg font-semibold mt-3'>Address</h1>
                            <input
                                value={address}
                                onChange={(e) => {
                                    setaddress(e.target.value)
                                }}
                                type="text"
                                placeholder='123 Market Streets'
                                className='text-lg p-2 outline-none mt-1 bg-[#ccc] text-black w-full py-2 rounded-md'
                            />
                            <button className='w-full py-2 border-none bg-red-600 font-bold mt-5 text-2xl rounded-sm'>Create Account</button>
                        </form>
                    </div>
                    <h4 className='text-md font-semibold mt-2'>Already have an Account? <Link to={'/food-partner/login'} className='text-blue-400'>Login</Link></h4>
                </div>
                <Link to={'/user/register'} className='w-1/2 p-3 text-lg bg-yellow-600 text-white font-bold rounded-r-full absolute bottom-3 left-4'>Register For User</Link>
            </div>
            <i className="text-white text-5xl ri-restaurant-2-fill absolute top-4 right-4"></i>
        </div>
    )
}

export default FoodPartnerSignup
