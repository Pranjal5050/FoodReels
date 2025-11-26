const foodModels = require('../models/food.model');
const likeModel = require('../models/Like.model');
const saveModel = require('../models/save.model');
const { v4:uuid } = require('uuid');
const storageService = require('../services/storage.service');

async function createFood(req, res) {
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());

    const foodItem = await foodModels.create({
        name : req.body.name,
        description : req.body.description,
        video : fileUploadResult.url,
        foodPartner : req.foodPartner._id,
    });
    res.status(201).json({message : "Food uploaded successfully", foodItem});
}

async function getFood(req, res) {
    const foodItem = await foodModels.find();
    res.status(200).json({message : "Food Fetched created successfully", foodItem});
}

async function likeFood(req, res){
    const {foodId} = req.body
    const user = req.user

    const userAlreadyLiked = await likeModel.findOne({
        user : user._id,
        foodId : foodId
    })

    if(userAlreadyLiked){
        await likeModel.deleteOne({
            user : user._id,
            foodId : foodId
        });
        await foodModels.findByIdAndUpdate(foodId, {
            $inc : {likeCount : -1}
        })
        return res.status(200).json({message : 'Food Unliked Successfully'});
    }

    const like = await likeModel.create({
       user : user._id,
       foodId : foodId
    });
    await foodModels.findByIdAndUpdate(foodId, {
        $inc : {likeCount : 1}
    })
    res.status(201).json({message : 'Liked Successfully', like});
}

async function saveFood(req, res){
    const {foodId} = req.body
    const user = req.user

    const userAlreadySaved = await saveModel.findOne({
        foodId : foodId,
        user : req.user
    })

    if(userAlreadySaved){
        await saveModel.deleteOne({
            foodId : foodId,
            user : user._id
        })
        await foodModels.findByIdAndUpdate(foodId, {
            $inc : {saveCount : -1}
        })
        return res.status(200).json({message : 'Food Unsaved Successfully'});
    }

    const save = await saveModel.create({
        foodId : foodId,
        user : user._id
    });
    await foodModels.findByIdAndUpdate(foodId, {
        $inc : {saveCount : 1}
    })
    
    res.status(201).json({message : 'Food saved succesfully', save});
}

async function getSaveFood(req, res){
    const user = req.user;

    const savedFoods = await saveModel.find({user : user._id}).populate('foodId');

    if(!savedFoods || savedFoods.length === 0){
        return res.status(404).json({message : "No saved food found"})
    }

    res.status(200).json({
        message : "Saved food fetched successfully",
        savedFoods
    })
}

module.exports = {
    createFood, 
    getFood, 
    likeFood, 
    saveFood, 
    getSaveFood
}