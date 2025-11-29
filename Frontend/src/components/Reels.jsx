import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Reels = () => {
  const videoRefs = useRef([]);
  const [reels, setReels] = useState([]);
  const [liked, setLiked] = useState({});
  const [bookmarked, setBookmarked] = useState({});
  const [commentCounts, setCommentCounts] = useState([]);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/food`,
          { withCredentials: true }
        );

        const data = res.data.foodItem || [];
        const mapped = data.map((item) => ({
          id: item._id,
          src: item.video,
          title: item.name,
          description: item.description,
          partnerId: item.foodPartner,
          likeCount: item.likeCount || 0,
          saveCount: item.saveCount || 0,
        }));
        setReels(mapped);
      } catch (err) {
        console.error("Fetch reels failed:", err);
      }
    };

    fetchReels();
  }, []);

  const likeVideo = async (item) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/food/like`,
        { foodId: item.id },
        { withCredentials: true }
      );

      const isLiked = Boolean(res.data.like);
      setReels((prev) =>
        prev.map((r) =>
          r.id === item.id
            ? { ...r, likeCount: isLiked ? r.likeCount + 1 : r.likeCount - 1 }
            : r
        )
      );
      setLiked((prev) => ({ ...prev, [item.id]: isLiked }));
    } catch (e) {
      console.error(e);
    }
  };

  const saveBookmark = async (item) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/food/save`,
        { foodId: item.id },
        { withCredentials: true }
      );

      const isSave = Boolean(res.data.save);
      setReels((prev) =>
        prev.map((r) =>
          r.id === item.id
            ? { ...r, saveCount: isSave ? r.saveCount + 1 : r.saveCount - 1 }
            : r
        )
      );
      setBookmarked((prev) => ({ ...prev, [item.id]: isSave }));
    } catch (e) {
      console.error(e);
    }
  };

  const openComments = (i) => {
    const comment = window.prompt("Add a comment");
    if (comment) {
      setCommentCounts((prev) => {
        const c = [...prev];
        c[i] = (c[i] || 0) + 1;
        return c;
      });
    }
  };

  // 🔥 Fix: Only one reel plays even with fast scroll
  useEffect(() => {
    if (reels.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.dataset.index);
          const video = videoRefs.current[index];
          if (!video) return;

          if (entry.intersectionRatio >= 0.8) {
            videoRefs.current.forEach((v, idx) => idx !== index && v && v.pause());
            video.currentTime = 0;
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.8 } // 👈 80% visible -> active video
    );

    document.querySelectorAll(".reel").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [reels]);

  return (
    <div className="h-screen w-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory">
      {reels.map((r, i) => (
        <div
          className="reel h-screen w-screen snap-start snap-always relative flex items-center justify-center bg-black"
          key={r.id}
          data-index={i}
        >
          <video
            ref={(el) => (videoRefs.current[i] = el)}
            src={r.src}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Title + Description + Visit Store */}
          <div className="absolute left-4 bottom-40 text-white max-w-[75%]">
            <h3 className="text-xl font-extrabold drop-shadow-md">{r.title}</h3>
            <p className="text-sm font-medium mt-1 mb-3 drop-shadow-md">
              {r.description}
            </p>
            <Link
              to={`/foodPartnerPage?id=${r.partnerId}`}
              className="bg-red-600 px-4 py-2 rounded-lg text-white font-semibold text-sm shadow-md"
            >
              Visit Store
            </Link>
          </div>

          {/* Like / Comment / Save */}
          <div className="absolute right-4 bottom-40 flex flex-col items-center gap-6 text-white">
            {/* LIKE */}
            <button onClick={() => likeVideo(r)} className="active:scale-110">
              {liked[r.id] ? (
                <svg width="32" height="32" fill="#ff2b54" viewBox="0 0 24 24">
                  <path d="M12 21s-7.447-4.873-10.261-8.044C-1.045 8.663 3.6 4 7.5 6.5 9.5 7.9 12 .5 12 .5s2.5 7.4 4.5 6c3.9-2.5 8.545 2.163 5.761 6.456C19.447 16.127 12 21 12 21z" />
                </svg>
              ) : (
                <svg
                  width="32"
                  height="32"
                  stroke="white"
                  fill="none"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.8 4.6c-1.9-2-4.9-2-6.8 0L12 6.6l-2-2c-1.9-2-4.9-2-6.8 0-2.2 2.3-2.2 6 0 8.3L12 21l8.8-8.1c2.2-2.3 2.2-6 0-8.3z" />
                </svg>
              )}
              <p className="text-xs font-bold mt-1">{r.likeCount}</p>
            </button>

            {/* COMMENT */}
            <button onClick={() => openComments(i)} className="active:scale-110">
              <svg
                width="30"
                height="30"
                stroke="white"
                fill="none"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <p className="text-xs font-bold mt-1">
                {commentCounts[i] || 0}
              </p>
            </button>

            {/* BOOKMARK */}
            <button onClick={() => saveBookmark(r)} className="active:scale-110">
              {bookmarked[r.id] ? (
                <svg width="30" height="30" fill="#ffd166" viewBox="0 0 24 24">
                  <path d="M6 2h12v20l-6-4-6 4V2z" />
                </svg>
              ) : (
                <svg
                  width="30"
                  height="30"
                  stroke="white"
                  fill="none"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              )}
              <p className="text-xs font-bold mt-1">{r.saveCount}</p>
            </button>
          </div>
        </div>
      ))}

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 w-full bg-black/50 backdrop-blur-md flex justify-around items-center py-3 z-[9999]">
        <Link to="/" className="text-white active:scale-110">
          <i className="ri-home-2-fill"></i>
        </Link>
        <Link to="/saveFood" className="text-white active:scale-110">
          <i className="ri-bookmark-fill"></i>
        </Link>
      </div>
    </div>
  );
};

export default Reels;
