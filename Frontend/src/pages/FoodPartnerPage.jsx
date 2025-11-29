import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation, useSearchParams, useNavigate, Link } from "react-router-dom";

const FoodPartnerPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [reels, setReels] = useState([]);
  const [expandedReel, setExpandedReel] = useState(null);
  const expandedVideoRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const partnerId =
    location?.state?.partnerId ||
    searchParams.get("id") ||
    location.pathname.split("/").pop() ||
    null;

  useEffect(() => {
    if (!partnerId) return;
    const load = async () => {
      setLoading(true);
      try {
        const partnerResp = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/foodPartner/${partnerId}`,
          { withCredentials: true }
        );
        const partnerData = partnerResp?.data?.partner;

        const foodsResp = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/food`,
          { withCredentials: true }
        );
        const allFoods = foodsResp?.data?.foodItem ?? [];
        const partnerReels = allFoods.filter(
          (f) => String(f.foodPartner) === String(partnerId)
        );

        setPartner(partnerData);
        setReels(partnerReels);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [partnerId]);

  const openExpanded = (r) => {
    setExpandedReel(r);
    document.body.style.overflow = "hidden";
  };
  const closeExpanded = () => {
    expandedVideoRef.current?.pause();
    setExpandedReel(null);
    document.body.style.overflow = "";
  };

  if (!partnerId)
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 font-medium">Partner not found.</p>
        <Link to="/" className="text-blue-500 underline mt-2 inline-block">
          Go Home
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-white p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-xl text-gray-700 active:scale-95"
        >
          <i className="ri-arrow-left-line"></i>
        </button>

        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-red-600 rounded-lg text-white font-semibold active:scale-95"
        >
          Logout
        </button>
      </div>

      {/* Profile Section */}
      {partner && (
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-32 h-32 rounded-full overflow-hidden border">
            <img
              className="w-full h-full object-cover"
              src={partner.image || "https://images.pexels.com/photos/31987477/pexels-photo-31987477.jpeg"}
              alt=""
            />
          </div>

          <h1 className="text-2xl font-extrabold mt-3">{partner.businessname}</h1>
          <p className="text-gray-600 text-sm font-medium">{partner.address}</p>
          <p className="text-gray-800 font-semibold mt-1">{partner.phone}</p>
          <p className="text-sm mt-2 text-gray-700">
            Reels Uploaded: <span className="font-bold">{reels.length}</span>
          </p>
        </div>
      )}

      {/* Reels Grid */}
      <div className="grid grid-cols-2 gap-3">
        {reels.map((r) => (
          <div
            key={r._id}
            onClick={() => openExpanded(r)}
            className="rounded-xl overflow-hidden bg-black cursor-pointer"
          >
            <video
              className="w-full h-52 object-cover"
              muted
              loop
              playsInline
              preload="metadata"
              src={r.video}
            />
          </div>
        ))}
      </div>

      {/* Fullscreen Player */}
      {expandedReel && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-[9999] flex items-center justify-center">
          <button
            onClick={closeExpanded}
            className="absolute top-4 right-4 text-white text-3xl active:scale-90"
          >
            ✕
          </button>

          <video
            ref={expandedVideoRef}
            src={expandedReel.video}
            autoPlay
            controls
            playsInline
            className="w-full h-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default FoodPartnerPage;
