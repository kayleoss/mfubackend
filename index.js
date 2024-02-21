const express = require("express"),
                app = express(),
                bodyParser = require('body-parser');
const cors = require('cors');
app.use(express.json());
app.use(cors());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').config();

const { MongoClient } = require("mongodb");

const uri = process.env.ATLAS_URI;
const client = new MongoClient(uri);
let db;

async function run() {
    db = client.db('Mfuphotography');
    console.log("connected to db")
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.render('forms', {message: ""})
});

app.get("/featured", async (req, res) => {
    const featuredPhotos = await db.collection('featured').find().toArray();
    res.json(featuredPhotos)
})

app.get("/mainfeatured", async (req, res) => {
    const mainFeatures = await db.collection('mainfeatured').find().toArray();
    res.json(mainFeatures)
})

app.get("/categories", async (req, res) => {
    const cats = await db.collection('categories').find().toArray();
    res.json(cats)
})

app.get("/images/:cat", async (req, res) => {
    const cat = req.params.cat;
    const images = await db.collection('images').find({category: cat}).toArray();
    res.json(images)
})

app.post("/", (req, res) => {
    const img = {
        name: req.body.photo_name,
        src: req.body.src,
        description: req.body.desc,
        price: req.body.price,
        purchaseLink: req.body.link,
        category: req.body.category
    }

    try {
        db.collection('images').insertOne(img)
        res.render("forms", {message: "<p class='success'>Sucessfully added new picture</p>"})
    } catch (e) {
        console.log(e)
        res.render("forms", {message: "<p class='fail'>Failed to add</p>"})
    }

    
})

app.listen(process.env.PORT || 5000, process.env.IP, ()=> {
  console.log('Server running')
})

module.exports = app;