const express = require('express');
const router = express.Router();
const authMIddlewares = require('../middlewares/auth.MIddlewares');
const foodController = require('../controllers/food.controller');
const multer = require('multer');

const upload = multer({
    storage : multer.memoryStorage()
})

/* POST /api/food/ {Protected} */
router.post('/', authMIddlewares.FoodPartnerMiddlewares, upload.single("video"), foodController.createFood);

/* GET /api/food/ {Protected} */
router.get('/', authMIddlewares.authUserMIddlewares ,foodController.getFood);

/* POST /api/food/ {Protected} */
router.post('/like', authMIddlewares.authUserMIddlewares, foodController.likeFood);

router.post('/save', authMIddlewares.authUserMIddlewares, foodController.saveFood);

router.get('/save', authMIddlewares.authUserMIddlewares, foodController.getSaveFood);


module.exports = router