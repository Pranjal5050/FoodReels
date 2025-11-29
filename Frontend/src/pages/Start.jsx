import React from'react';
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div className="w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center relative">

      {/* 🎥 Video Box */}
      <div className="w-[90%] h-[76%] rounded-xl overflow-hidden flex justify-center items-center">
        <video
          className="w-full h-full object-cover"
          src="https://cdn.pixabay.com/video/2024/04/25/209418_tiny.mp4"
          autoPlay
          muted
          loop
          playsInline
        ></video>
      </div>

      {/* 🔻 Bottom Button */}
      <Link
        to="/user/login"
        className="w-[90%] py-3 rounded-lg bg-red-600 text-white font-bold text-center text-lg mt-4 active:scale-95"
      >
        Get Started
      </Link>
    </div>
  );
};

export default Start;
