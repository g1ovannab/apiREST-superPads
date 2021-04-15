const express = require('express');
const consign = require('consign');
const mongoose = require('mongoose');

module.exports = () => {
    const app = express();

    app.use(express.urlencoded({extended: true}));
    app.use(express.json());

    app.set('view engine', 'ejs');
    app.use(express.static("public"));

    mongoose.connect("mongodb://localhost:27017/superpadsDB", {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Connected to MongoDB...')
    })
    .catch((err) => {
        console.error("Coudn't connect MongoDB...", err)
    });  

    mongoose.set('useFindAndModify', false);

    consign({cwd: 'api'})
    .then("routes")
    .into(app);

    return app;
}
