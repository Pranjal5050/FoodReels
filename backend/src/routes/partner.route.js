const express = require('express')
const router = express.Router()
const partnerController = require('../controllers/partner.controller');
const authMiddleWares = require('../middlewares/auth.MIddlewares');

// GET /api/foodPartner/:id
router.get('/:id',authMiddleWares.authUserMIddlewares ,partnerController.getPartnerById)

module.exports = router
