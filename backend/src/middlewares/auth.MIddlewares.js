const foodPartnermodle = require('../models/food.partner');
const userModel = require("../models/user.model");
const jwt = require('jsonwebtoken');

async function FoodPartnerMiddlewares(req, res, next) {
    const token = req.cookies.token
    console.log(token);
    if(!token){
        return res.status(401).json({message : 'Please Login first'})
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const foodPartner = await foodPartnermodle.findById(decoded.id);
        if(!foodPartner){
            res.status(401).json({message : "Unauthorized"});
        }
        req.foodPartner = foodPartner;
        next();
    } catch (error) {
        return res.status(401).json({message : "Invalid Token"})
    }
}

async function authUserMIddlewares(req, res, next) {
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({message : "Please Login first"});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        req.user = user
        next();
    } catch (error) {
        res.status(401).json({message : "Invalid User"});
    }
}

module.exports = {
    FoodPartnerMiddlewares,
    authUserMIddlewares
}