const userModel = require("../models/user.model");
const foodPartnerModel = require('../models/food.partner');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registeruser(req, res) {
    const { fullname, email, password } = req.body;

    const userAlreadyExists = await userModel.findOne({
        email
    })

    if (userAlreadyExists) {
        return res.status(400).json({ massege: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        fullname: {
            firstname: fullname.firstname,
            lastname: fullname.lastname
        },
        email,
        password: hashedPassword
    })

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET);
    res.cookie('token', token);

    res.status(201).json({
        message: "user created successfully",
        token : token,
        user: {
            _id: user._id,
            email: user.email,
            firstname: user.fullname.firstname,
            lastname: user.fullname.lastname
        }
    })
}

async function loginuser(req, res) {
    const { email, password } = req.body;
    console.log(email, password)

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({ massege: "User Not found" })
    }

    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword) {
        res.status(401).json({ message: 'Email and password incorrect' });
    }

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET);

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });
    res.status(200).json({
        message: "Login Successfully",
        token : token,
        user: {
            _id: user._id,
            email: user.email,
            fullname: user.fullname
        }
    })
}

function logout(req, res) {
    res.clearCookie('token');
    res.status(200).json({ message: "User Logout Successfully" });
}

async function registerfoodpartner(req, res) {
    const { businessname, contactname, phone, address, email, password } = req.body;

    const userAlreadyExists = await foodPartnerModel.findOne({
        email
    })

    if (userAlreadyExists) {
        return res.status(400).json({ massege: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const foodpartner = await foodPartnerModel.create({
        businessname,
        contactname,
        phone,
        address,
        email,
        password: hashedPassword
    })

    const token = jwt.sign({
        id: foodpartner._id
    }, process.env.JWT_SECRET);
    // SET COOKIE FIRST
    res.cookie("token", token);

    res.status(201).json({
        message: "foodpartner created successfully",
        token : token,
        foodpartner: {
            _id: foodpartner._id,
            email: foodpartner.email,
            businessname: foodpartner.businessname,
            contactname: foodpartner.contactname,
            phone: foodpartner.phone,
            address: foodpartner.address
        }
    })
}

async function loginfoodpartner(req, res) {
    const { email, password } = req.body;

    const foodpartner = await foodPartnerModel.findOne({
        email
    });

    if (!foodpartner) {
        return res.status(400).json({ massege: "Email and Paassword Incorrect" })
    }

    const verifyPassword = await bcrypt.compare(password, foodpartner.password);
    if (!verifyPassword) {
        return res.status(501).json({ message: "Email and Paassword Incorrect" })
    }
    
    const token = jwt.sign({
        id: foodpartner._id
    }, process.env.JWT_SECRET);
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });
    

    res.status(200).json({
        message: "Login successfully",
        token: token,
        foodpartner: {
            _id: foodpartner._id,
            email: foodpartner.email,
            businessname: foodpartner.businessname,
            contactname: foodpartner.contactname,
            phone: foodpartner.phone,
            address: foodpartner.address
        }
    })

}

function logoutfoodPartner(req, res) {
    res.clearCookie('token');
    res.status(200).json({ message: "User Logout Successfully" });
}

module.exports = {
    registeruser,
    loginuser,
    logout,
    registerfoodpartner,
    loginfoodpartner,
    logoutfoodPartner
}