const foodPartnerModel = require('../models/food.partner')

async function getPartnerById(req, res) {
  try {
    const id = req.params.id
    const partner = await foodPartnerModel.findById(id).select('-password')
    if (!partner) return res.status(404).json({ message: 'Partner not found' })
    res.status(200).json({ partner })
  } catch (err) {
    console.error('getPartnerById error', err)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getPartnerById }
