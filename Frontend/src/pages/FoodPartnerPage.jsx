import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useLocation, useSearchParams, useNavigate, Link } from 'react-router-dom'

const FoodPartnerPage = () => {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [partner, setPartner] = useState(null)
  const [reels, setReels] = useState([])
  const [expandedReel, setExpandedReel] = useState(null)
  const expandedVideoRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // partner id can be passed via query ?id=, route params, or location.state.partnerId
  const partnerId =
    location?.state?.partnerId || searchParams.get('id') || (location.pathname.split('/').pop() || null)

  useEffect(() => {
    if (!partnerId) return

    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        // 1) fetch partner details (we added a small endpoint at /api/foodPartner/:id)
        const partnerResp = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/foodPartner/${partnerId}`, { withCredentials: true })
        const partnerData = partnerResp?.data?.partner ?? partnerResp?.data ?? null

        // 2) fetch all food and filter by foodPartner id (backend GET /api/food returns foodItem array)
        const foodsResp = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/food`, { withCredentials: true })
        const allFoods = foodsResp?.data?.foodItem ?? foodsResp?.data ?? []
        const partnerReels = Array.isArray(allFoods) ? allFoods.filter((f) => String(f.foodPartner) === String(partnerId)) : []

        if (!cancelled) {
          setPartner(partnerData)
          setReels(partnerReels)
        }
      } catch (err) {
        if (!cancelled) setError(err.message || String(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => { cancelled = true }
  }, [partnerId])

  // open expanded player for a selected reel
  const openExpanded = (r) => {
    setExpandedReel(r)
    try { document.body.style.overflow = 'hidden' } catch (e) {}
  }

  const closeExpanded = () => {
    // pause the expanded video if playing
    try { if (expandedVideoRef.current) expandedVideoRef.current.pause() } catch (e) {}
    setExpandedReel(null)
    try { document.body.style.overflow = '' } catch (e) {}
  }

  // close on Esc
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeExpanded() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expandedReel])

  if (!partnerId) return (
    <div className="p-6">
      <p>No partner specified. Please open a reel's "Visit Store" link to view the partner page.</p>
      <p className="mt-4"><Link to="/" className="text-blue-600">Back to feed</Link></p>
    </div>
  )

  return (
    <div className="p-6">
      <div className='flex items-center justify-between'>
        <button onClick={() => navigate(-1)} className="mb-4 px-3 py-1 bg-gray-100 font-bold rounded"><i className="ri-arrow-left-line"></i></button>
        <button onClick={() => navigate(-1)} className="mb-4 px-2 py-1 text-sm bg-red-600 font-bold text-white rounded">Logout</button>
    </div>
    <div className='w-32 h-32 border rounded-full overflow-hidden border-none'>
      <img className='w-full h-full object-cover' src="https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Zm9vZCUyMHBob3RvZ3JhcGh5fGVufDB8fDB8fHww" alt="" />
    </div>

      {loading && <p>Loading partner…</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && partner && (
        <div>
          <h1 className="text-2xl font-bold">{partner.businessname ?? 'Partner'}</h1>
          <h1 className="text-2xl font-bold">{partner.address ?? 'Address'}</h1>
          <p className="mt-2">Reels uploaded: <strong>{reels.length}</strong></p>

          <div className="mt-6 flex flex-wrap gap-4">
            {reels.map((r) => (
              <div key={r._id} className="border rounded-md overflow-hidden w-38 h-62 cursor-pointer" onClick={() => openExpanded(r)}>
                <video src={r.video} muted loop playsInline preload="metadata" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Expanded full-screen player overlay */}
          {expandedReel && (
            <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'#000',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <button onClick={closeExpanded} style={{position:'absolute',top:18,right:18,zIndex:2010,background:'rgba(0,0,0,0.6)',color:'#fff',border:'none',padding:'8px 12px',borderRadius:6,cursor:'pointer'}}>✕</button>
              <video
                ref={expandedVideoRef}
                src={expandedReel.video ?? expandedReel.src}
                controls
                autoPlay
                playsInline
                style={{width:'100vw',height:'100vh',objectFit:'cover'}}
              />
            </div>
          )}
        </div>
      )}

      {!loading && !partner && !error && (
        <div>
          <p>No partner information found for id <strong>{partnerId}</strong>.</p>
        </div>
      )}
    </div>
  )
}

export default FoodPartnerPage
