import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import axios from "axios";
import { AuthContext } from "../Context/UserContext";

const UserSignup = () => {
  const [firstname, setfirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { user, setUserData } = useContext(AuthContext);

  const submitHandeler = async (e) => {
    e.preventDefault();
    const userData = {
      fullname: { firstname, lastname },
      email,
      password,
    };
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/auth/user/register`,
      userData
    );
    if (response.status === 201) {
      const data = response.data;
      setUserData(data.user);
      localStorage.setItem("token", data.token);
      navigate("/home");
    }
    setfirstname("");
    setLastname("");
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
        <h1 className="text-5xl font-bold text-center tracking-wide">Create Account</h1>

        <form
          onSubmit={submitHandeler}
          className="mt-10 bg-white/10 backdrop-blur-md p-7 rounded-xl shadow-lg w-[90%] max-w-[550px]"
        >
          <div className="flex gap-5">
            <div className="w-1/2">
              <label className="text-lg font-medium">Firstname</label>
              <input
                placeholder="John"
                value={firstname}
                onChange={(e) => setfirstname(e.target.value)}
                type="text"
                className="w-full text-lg p-2 mt-1 rounded-md bg-white/80 text-black outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="w-1/2">
              <label className="text-lg font-medium">Lastname</label>
              <input
                placeholder="Doe"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                type="text"
                className="w-full text-lg p-2 mt-1 rounded-md bg-white/80 text-black outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <label className="text-lg font-medium mt-4 block">Email</label>
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
            placeholder="********"
            className="w-full text-lg p-2 mt-1 rounded-md bg-white/80 text-black outline-none focus:ring-2 focus:ring-red-500"
          />

          <button className="w-full py-3 bg-red-600 hover:bg-red-700 transition-all mt-6 text-xl font-semibold rounded-md shadow-md">
            Create Account
          </button>
        </form>

        <p className="mt-4 text-lg">
          Already have an Account?{" "}
          <Link to="/user/login" className="text-blue-300 underline">
            Login
          </Link>
        </p>

        <Link
          to="/food-partner/register"
          className="mt-6 bg-orange-600 px-8 py-3 text-lg font-bold rounded-full shadow-lg hover:bg-orange-700 transition-all"
        >
          Register For Food Partner
        </Link>
      </div>
    </div>
  );
};

export default UserSignup;
