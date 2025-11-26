import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateFood = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [video, setVideo] = useState(null)
  const [preview, setPreview] = useState(null)
  const navigate = useNavigate();

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    setVideo(file)
    if (file) {
      setPreview(URL.createObjectURL(file))
    } else {
      setPreview(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('video', video);

    // Replace with your backend endpoint
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/food`, formData, {
      withCredentials: true,
      headers: {
      "Content-Type": "multipart/form-data",
    }
    });
    console.log(res.data);
    navigate('/home');

    setName('');
    setDescription('');
    setVideo(null);
    setPreview(null);
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Food Item</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block font-semibold mb-2">Food Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 outline-none"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder="Enter food name"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2 outline-none"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            placeholder="Enter description"
            rows={3}
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Food Video</label>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-red-400 rounded-lg p-6 bg-gray-50">
            <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center">
              <span className="text-4xl mb-2 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 00-7.5 0v4.5m11.25 0a2.25 2.25 0 012.25 2.25v6a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25v-6a2.25 2.25 0 012.25-2.25m11.25 0h-15" />
                </svg>
              </span>
              <span className="text-gray-700 font-medium mb-2">Click to select video file</span>
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoChange}
                required
              />
            </label>
            {preview && (
              <video src={preview} controls className="mt-4 w-full h-64 object-cover rounded shadow" />
            )}
          </div>
        </div>
        <button
          type="submit"
          className="bg-red-600 text-white font-bold py-2 px-6 rounded hover:bg-red-700 transition"
        >
          Submit
        </button>

      </form>
    </div>
  )
}

export default CreateFood
