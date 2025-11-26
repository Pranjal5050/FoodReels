import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios'
import './reels.css'
import { Link } from 'react-router-dom'

const Reels = () => {
    const videoRefs = useRef([])
    const [reels, setReels] = useState([])
    const [liked, setLiked] = useState([])
    const [bookmarked, setBookmarked] = useState([])
    const [likeCounts, setLikeCounts] = useState([])
    const [commentCounts, setCommentCounts] = useState([])
    const [bookmarkCounts, setBookmarkCounts] = useState([])

    // -------------------------------
    // Fetch reels from backend
    // -------------------------------
    useEffect(() => {
        const fetchReels = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/food`, {
                    withCredentials: true
                });

                // Your data is in res.data.foodItem
                const data = res.data.foodItem || []

                const mapped = data.map((item) => ({
                    id: item._id,
                    src: item.video,
                    title: item.name,
                    description: item.description,
                    partnerId: item.foodPartner, // keep reference to which partner uploaded this reel
                    likeCount: item.likeCount || 0,    // 👈 ADD THIS add kiya h abhi
                    saveCount: item.saveCount || 0    // 👈 ADD THIS add kiya h abhi

                }))

                setReels(mapped);

                

                //setMutedStates(mapped.map(() => true))  // default muted for autoplay
            } catch (err) {
                console.error("Fetch reels failed:", err)
            }
        }
        fetchReels()
    }, [])




    const likeVideo = async (item) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/food/like`,
            { foodId: item.id },
            { withCredentials: true }
        );

        const isLiked = Boolean(response.data.like);

        // 🔥 Update reels state — THIS IS THE FIX 🔥
        setReels((prevReels) =>
            prevReels.map((r) =>
                r.id === item.id
                    ? { ...r, likeCount: isLiked ? r.likeCount + 1 : r.likeCount - 1 }
                    : r
            )
        );

        // 🔥 update liked UI state
        setLiked((prev) => ({
            ...prev,
            [item.id]: isLiked
        }));

    } catch (err) {
        console.error("Failed to toggle like:", err);
    }
};



const saveBookmark = async (item) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/food/save`,
      { foodId: item.id }, // use `id` instead of `_id`
      { withCredentials: true }
    );

    const isSave = Boolean(response.data.save);

    // Update reels array for UI count
    setReels(prevReels =>
      prevReels.map(r =>
        r.id === item.id
          ? { ...r, saveCount: isSave ? r.saveCount + 1 : r.saveCount - 1 }
          : r
      )
    );

    // Update bookmarked UI
    setBookmarked(prev => ({
      ...prev,
      [item.id]: isSave
    }));
  } catch (err) {
    console.error("Failed to toggle bookmark:", err);
  }
};

    const openComments = (i) => {
        // simple prompt for demonstration; replace with modal as needed
        const comment = window.prompt('Add a comment')
        if (comment) {
            console.log('Comment for', reels[i]?.id, comment)
            // increment comment count
            setCommentCounts((prev) => {
                const copy = [...prev]
                copy[i] += 1
                return copy
            })
        }
    }

    const setVideoRef = (el, i) => {
        videoRefs.current[i] = el
    }

    // -------------------------------
    // Autoplay when visible
    // -------------------------------
    useEffect(() => {
        if (reels.length === 0) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = Number(entry.target.dataset.index)
                    const video = videoRefs.current[index]

                    if (entry.isIntersecting) {
                        videoRefs.current.forEach((v, idx) => {
                            if (idx !== index && v) v.pause()
                        })

                        video.currentTime = 0
                        //video.muted = mutedStates[index]
                        video.play().catch(() => { })
                    } else {
                        video.pause()
                    }
                })
            },
            { threshold: 0.7 }
        )

        document
            .querySelectorAll('.reel')
            .forEach((el) => observer.observe(el))

        return () => observer.disconnect()
    }, [reels])

    return (
        <div className="reels-wrapper">
            {reels.map((r, i) => (
                <div className="reel" key={r.id} data-index={i}>
                    <video
                        ref={(el) => setVideoRef(el, i)}
                        className="reel-video"
                        src={r.src}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                    />

                    <div className="reel-overlay">
                        <h3>{r.title}</h3>
                        <p className='mb-5 font-bold'>{r.description}</p>
                        {/* pass partner id via query param so FoodPartnerPage can fetch partner details */}
                        <Link to={`/foodPartnerPage?id=${r.partnerId}`} className='bg-red-600 text-white py-2 px-6 rounded-md font-bold'>Visit Store</Link>
                    </div>

                    <div className="reel-actions">
                        <button className="action-btn" onClick={() => likeVideo(r)} aria-label="Like">
                            {liked[r.id] ? (
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="#ff385c" xmlns="http://www.w3.org/2000/svg"><path d="M12 21s-7.447-4.873-10.261-8.044C-1.045 8.663 3.6 4 7.5 6.5 9.5 7.9 12 .5 12 .5s2.5 7.4 4.5 6c3.9-2.5 8.545 2.163 5.761 6.456C19.447 16.127 12 21 12 21z" /></svg>
                            ) : (
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M20.8 4.6c-1.9-2-4.9-2-6.8 0L12 6.6l-2-2c-1.9-2-4.9-2-6.8 0-2.2 2.3-2.2 6 0 8.3L12 21l8.8-8.1c2.2-2.3 2.2-6 0-8.3z" /></svg>
                            )}
                            <span className="action-count">{r.likeCount}</span>
                        </button>

                        <button className="action-btn" onClick={() => openComments(i)} aria-label="Comment">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                            <span className="action-count">{commentCounts[i] || 0}</span>
                        </button>

                        <button className="action-btn" onClick={() => saveBookmark(r)} aria-label="Bookmark">
                            {bookmarked[i] ? (
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="#ffd166" xmlns="http://www.w3.org/2000/svg"><path d="M6 2h12v20l-6-4-6 4V2z" /></svg>
                            ) : (
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                            )}
                            <span className="action-count">{r.saveCount}</span>
                        </button>
                    </div>
                </div>
            ))}
            {/* bottom fixed bar with home and bookmarks */}
            <div className="reels-bottom-bar">
                <Link to="/" className="reels-bottom-btn" title="Home">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" /></svg>
                </Link>
                <Link to="/saveFood" className="reels-bottom-btn" title="Bookmarks">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                </Link>
            </div>
        </div>
    )
}

export default Reels
