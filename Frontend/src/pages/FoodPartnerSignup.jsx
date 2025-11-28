import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthPratnerContext } from "../Context/PartnerContext";

const FoodPartnerSignup = () => {
  const [businessname, setBusinessname] = useState("");
  const [contactname, setContactname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setaddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { partner, setPartner } = useContext(AuthPratnerContext);
  const navigate = useNavigate();

  const submitHandeler = async (e) => {
    e.preventDefault();

    const partnerData = {
      businessname,
      contactname,
      phone,
      email,
      address,
      password,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/auth/food-partner/register`,
      partnerData,
      { withCredentials: true }
    );

    if (response.status === 201) {
      const data = response.data;
      setPartner(data.foodpartner);
      localStorage.setItem("token", data.token);
      navigate("/home");
    }

    setBusinessname("");
    setContactname("");
    setPhone("");
    setaddress("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="w-full min-h-screen relative font-[Poppins] text-white">
      {/* Background image */}
      <img
        className="w-full h-full absolute inset-0 object-cover brightness-50"
        src="https://images.unsplash.com/photo-1549831933-17b6be99565e?w=800"
        alt=""
      />

      {/* Scrollable content */}
      <div className="relative z-10 w-full min-h-screen overflow-y-auto flex flex-col items-center px-6 py-6">
        
        {/* Top Icon */}
        <i className="ri-restaurant-2-fill text-6xl mb-4 drop-shadow-2xl"></i>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-wide text-center">
          Partner Registration
        </h1>

        {/* Form Card */}
        <form
          onSubmit={submitHandeler}
          className="mt-8 bg-white/10 backdrop-blur-md shadow-lg p-7 rounded-2xl w-full max-w-[600px]"
        >
          <label className="text-lg font-medium">Business Name</label>
          <input
            placeholder="e.g. Tasty Foods"
            value={businessname}
            onChange={(e) => setBusinessname(e.target.value)}
            type="text"
            className="w-full text-lg p-2 mt-1 rounded-md bg-white/85 text-black outline-none focus:ring-2 focus:ring-orange-500"
          />

          <div className="flex gap-5 mt-4">
            <div className="w-1/2">
              <label className="text-lg font-medium">Contact Name</label>
              <input
                placeholder="John Doe"
                value={contactname}
                onChange={(e) => setContactname(e.target.value)}
                type="text"
                className="w-full text-lg p-2 mt-1 rounded-md bg-white/85 text-black outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="w-1/2">
              <label className="text-lg font-medium">Phone</label>
              <input
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="number"
                className="w-full text-lg p-2 mt-1 rounded-md bg-white/85 text-black outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <label className="text-lg font-medium mt-4 block">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="example@gmail.com"
            className="w-full text-lg p-2 mt-1 rounded-md bg-white/85 text-black outline-none focus:ring-2 focus:ring-orange-500"
          />

          <label className="text-lg font-medium mt-4 block">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="********"
            className="w-full text-lg p-2 mt-1 rounded-md bg-white/85 text-black outline-none focus:ring-2 focus:ring-orange-500"
          />

          <label className="text-lg font-medium mt-4 block">Address</label>
          <input
            value={address}
            onChange={(e) => setaddress(e.target.value)}
            type="text"
            placeholder="123 Market Street"
            className="w-full text-lg p-2 mt-1 rounded-md bg-white/85 text-black outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button className="w-full py-3 bg-orange-600 hover:bg-orange-700 transition-all mt-6 text-xl font-semibold rounded-md shadow-md">
            Create Account
          </button>
        </form>

        {/* Links */}
        <p className="mt-4 text-lg">
          Already have an account?{" "}
          <Link to="/food-partner/login" className="text-blue-300 underline">
            Login
          </Link>
        </p>

        <Link
          to="/user/register"
          className="mt-5 bg-yellow-600 px-7 py-3 text-lg font-bold rounded-full shadow-md hover:bg-yellow-700 transition-all"
        >
          Register as User
        </Link>
      </div>
    </div>
  );
};

export default FoodPartnerSignup;
