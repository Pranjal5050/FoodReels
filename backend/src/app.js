const dotenv = require('dotenv');
dotenv.config();
const express = require('express')
const app = express();
const cors = require('cors');

app.set('trust proxy', 1); // trust first proxy

app.use(cors({
    origin: ["https://sparkly-tartufo-20b593.netlify.app",
        "https://foodreels-yriy.onrender.com"
    ],   // your frontend URL
    credentials: true                  // allow cookies
}));
const cookieparser = require("cookie-parser");
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.route');
const partnerRoutes = require('./routes/partner.route');

app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/foodPartner', partnerRoutes);

app.get('/', function(req, res){
      res.send("hello")
});

module.exports = app;

