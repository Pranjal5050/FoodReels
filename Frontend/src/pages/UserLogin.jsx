import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/UserContext";

const UserLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { user, setUserData } = useContext(AuthContext);
    const navigate = useNavigate();

    const submitHandeler = async (e) => {
        e.preventDefault();
        const userLogin = { email, password };
        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/auth/user/login`,
            userLogin,
            { withCredentials: true }
        );
        if (response.status === 200) {
            const data = response.data;
            setUserData(data.user);
            localStorage.setItem("token", data.token);
            navigate("/home");
        }
        setEmail("");
        setPassword("");
    };

    return (
        <div className="w-full h-screen relative font-[Poppins]">
            <img
                className="w-full h-full object-cover brightness-50"
                src="https://images.unsplash.com/photo-1549831933-17b6be99565e?w=800"
                alt=""
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
                <i className="ri-restaurant-2-fill text-6xl mb-3 drop-shadow-xl"></i>
                <h1 className="text-5xl font-bold text-center tracking-wide">
                    Welcome Back
                </h1>

                <form
                    onSubmit={submitHandeler}
                    className="mt-10 bg-white/10 backdrop-blur-md p-7 rounded-xl shadow-lg w-[90%] max-w-[550px]"
                >
                    <label className="text-lg font-medium mt-2 block">Email</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="example@gmail.com"
                        className="w-full text-lg p-2 mt-1 rounded-md bg-white/80 text-black outline-none focus:ring-2 focus:ring-red-500"
                    />

                    <label className="text-lg font-medium mt-4 block">Password</label>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="************"
                        className="w-full text-lg p-2 mt-1 rounded-md bg-white/80 text-black outline-none focus:ring-2 focus:ring-red-500"
                    />

                    <button className="w-full py-3 bg-red-600 hover:bg-red-700 transition-all mt-6 text-xl font-semibold rounded-md shadow-md">
                        Login
                    </button>
                </form>

                <p className="mt-4 text-lg">
                    Not yet Account?{" "}
                    <Link to="/user/register" className="text-blue-300 underline">
                        Register
                    </Link>
                </p>

                <p className="mt-6 w-[85%] text-center text-sm text-gray-300">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur
                    commodi placeat necessitatibus earum ipsa id recusandae et odit.
                </p>
            </div>
        </div>
    );
};

export default UserLogin;
