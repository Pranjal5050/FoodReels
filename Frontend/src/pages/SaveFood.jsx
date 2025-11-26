import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from 'react-router-dom'
import '../components/reels.css'

const SaveFood = () => {
    const [savedReels, setSavedReels] = useState([]);
    const [likedMap, setLikedMap] = useState({});
    const [bookmarkedMap, setBookmarkedMap] = useState({});
    const [commentCounts, setCommentCounts] = useState({});
    const videoRefs = useRef([]);

    useEffect(() => {
        fetchSavedReels();
    }, []);

    // Fetch saved reels (normalize shape to match Reels component)
    async function fetchSavedReels() {
        try {
            const res = await axios.get("http://localhost:3000/api/food/save", { withCredentials: true });
            const data = res.data.savedFoods || [];

            // normalize: each item -> { id, src, title, description, partnerId, likeCount, saveCount }
            const mapped = data.map((s) => {
                const f = s.foodId || s; // some responses nest under foodId
                return {
                    rawId: s._id,
                    id: f._id || f.id,
                    src: f.video,
                    title: f.name,
                    description: f.description,
                    partnerId: f.foodPartner,
                    likeCount: f.likeCount || 0,
                    saveCount: f.saveCount || 0
                };
            });

            setSavedReels(mapped);

            // initialize maps
            const likes = {};
            const saves = {};
            const comments = {};
            mapped.forEach((m) => {
                likes[m.id] = false;
                saves[m.id] = true; // these are saved reels, so bookmarked true by default
                comments[m.id] = 0;
            });
            setLikedMap(likes);
            setBookmarkedMap(saves);
            setCommentCounts(comments);

        } catch (err) {
            console.log("Error fetching saved reels:", err);
        }
    }

    // Toggle like using backend API
    const toggleLike = async (item) => {
        try {
            const response = await axios.post(
                'http://localhost:3000/api/food/like',
                { foodId: item.id },
                { withCredentials: true }
            );

            const isLiked = Boolean(response.data.like);

            setSavedReels((prev) => prev.map((r) => r.id === item.id ? { ...r, likeCount: isLiked ? r.likeCount + 1 : Math.max(0, r.likeCount - 1) } : r));
            setLikedMap((prev) => ({ ...prev, [item.id]: isLiked }));
        } catch (err) {
            console.error('Failed to toggle like', err);
        }
    };

    // Toggle save/bookmark using backend API
    const toggleSave = async (item) => {
        try {
            const response = await axios.post(
                'http://localhost:3000/api/food/save',
                { foodId: item.id },
                { withCredentials: true }
            );

            const isSave = Boolean(response.data.save);

            setSavedReels((prev) => prev.map((r) => r.id === item.id ? { ...r, saveCount: isSave ? r.saveCount + 1 : Math.max(0, r.saveCount - 1) } : r));
            setBookmarkedMap((prev) => ({ ...prev, [item.id]: isSave }));

            // if unsaved (user removed save) optionally remove from list
            if (!isSave) {
                setSavedReels((prev) => prev.filter((r) => r.id !== item.id));
            }
        } catch (err) {
            console.error('Failed to toggle save', err);
        }
    };

    // Add comment: attempt backend comment endpoint, fallback to prompt
    const addComment = async (item) => {
        const text = window.prompt('Add a comment')
        if (!text) return

        try {
            // try calling backend comment endpoint (if available)
            await axios.post('http://localhost:3000/api/food/comment', { foodId: item.id, text }, { withCredentials: true })
            setCommentCounts((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }))
        } catch (err) {
            // fallback: increment locally
            console.warn('Comment endpoint not available or failed, saved locally', err)
            setCommentCounts((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }))
        }
    }

    const setVideoRef = (el, i) => {
        videoRefs.current[i] = el
    }

    return (
        <div className="w-full min-h-screen bg-black text-white pb-24">
            {/* Header */}
            <div className="sticky top-0 bg-black p-4 border-b border-gray-800 z-10">
                <h1 className="text-xl font-semibold text-center">Saved Reels</h1>
            </div>

            {/* If no reels */}
            {savedReels.length === 0 && (
                <p className="text-center text-gray-400 mt-10 text-lg">No saved reels found</p>
            )}

            <div className="reels-wrapper">
                {savedReels.map((r, i) => (
                    <div className="reel" key={r.id} data-index={i}>
                        <video
                            ref={(el) => setVideoRef(el, i)}
                            className="reel-video"
                            src={r.src}
                            muted
                            loop
                            autoPlay
                            playsInline
                            preload="metadata"
                        />

                        <div className="reel-overlay">
                            <h3>{r.title}</h3>
                            <p className='mb-5'>{r.description}</p>
                            <Link to={`/foodPartnerPage?id=${r.partnerId}`} className='reel-store-btn'>Visit Store</Link>
                        </div>

                        <div className="reel-actions">
                            <button className="action-btn" onClick={() => toggleLike(r)} aria-label="Like">
                                {likedMap[r.id] ? (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#ff385c" xmlns="http://www.w3.org/2000/svg"><path d="M12 21s-7.447-4.873-10.261-8.044C-1.045 8.663 3.6 4 7.5 6.5 9.5 7.9 12 .5 12 .5s2.5 7.4 4.5 6c3.9-2.5 8.545 2.163 5.761 6.456C19.447 16.127 12 21 12 21z"/></svg>
                                ) : (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M20.8 4.6c-1.9-2-4.9-2-6.8 0L12 6.6l-2-2c-1.9-2-4.9-2-6.8 0-2.2 2.3-2.2 6 0 8.3L12 21l8.8-8.1c2.2-2.3 2.2-6 0-8.3z"/></svg>
                                )}
                                <span className="action-count">{r.likeCount}</span>
                            </button>

                            <button className="action-btn" onClick={() => addComment(r)} aria-label="Comment">
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                <span className="action-count">{commentCounts[r.id] || 0}</span>
                            </button>

                            <button className="action-btn" onClick={() => toggleSave(r)} aria-label="Bookmark">
                                {bookmarkedMap[r.id] ? (
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="#ffd166" xmlns="http://www.w3.org/2000/svg"><path d="M6 2h12v20l-6-4-6 4V2z"/></svg>
                                ) : (
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                                )}
                                <span className="action-count">{r.saveCount}</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SaveFood;
