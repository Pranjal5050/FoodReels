import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateFood = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("video", video);

    await axios.post(`${import.meta.env.VITE_BASE_URL}/api/food`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });

    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-black flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">

        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="text-white text-xl mb-4 active:scale-90"
        >
          <i className="ri-arrow-left-line"></i>
        </button>

        <h2 className="text-3xl font-extrabold text-center text-white mb-6 tracking-wide">
          Upload New Reel
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Food Name */}
          <div>
            <label className="text-white font-semibold">Food Name</label>
            <input
              type="text"
              className="w-full mt-1 p-3 rounded-lg bg-white/20 text-white placeholder-gray-200 outline-none focus:ring-2 ring-red-400 transition"
              placeholder="Enter food name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-white font-semibold">Description</label>
            <textarea
              className="w-full mt-1 p-3 rounded-lg bg-white/20 text-white placeholder-gray-200 outline-none focus:ring-2 ring-red-400 transition"
              placeholder="Enter description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Video Upload */}
          <div>
            <label className="text-white font-semibold">Food Video</label>
            <div className="mt-2 border-2 border-dashed border-white/40 rounded-xl bg-white/10 p-6 flex flex-col items-center cursor-pointer hover:border-red-400 transition">
              <label htmlFor="video-upload" className="flex flex-col items-center">
                <span className="text-5xl text-red-300">
                  <i className="ri-video-upload-line"></i>
                </span>
                <span className="text-gray-200 mt-2 font-medium">
                  Click to upload video
                </span>
                <input
                  id="video-upload"
                  type="file"
                  className="hidden"
                  accept="video/*"
                  required
                  onChange={handleVideoChange}
                />
              </label>

              {/* Preview */}
              {preview && (
                <video
                  src={preview}
                  controls
                  className="mt-5 w-full h-60 object-cover rounded-xl shadow-md"
                />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-2 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-extrabold text-lg tracking-wide shadow-md active:scale-95 transition"
          >
            Upload Reel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateFood;
