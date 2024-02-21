const express = require("express");
const { v4 } = require('uuid');
var cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors())
require('dotenv').config()

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
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.send(`This is a test /`);
});

app.get("/api", (req, res) => {
    const path = `/api/item/${v4()}`;
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get("/api/featured", (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    const featuredPhotos = db.collection('featured').find().toArray();
    res.json(featuredPhotos)
})

app.get("/api/mainfeatured", (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    const mainFeatures = db.collection('mainfeatured').find().toArray();
    res.json(mainFeatures)
})

app.get("/api/categories", (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    const cats = db.collection('categories').find().toArray();
    res.json(cats)
})

app.get("/api/images/:cat", (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    const cat = req.params.cat;
    const images = db.collection('images').find({category: cat}).toArray();
    res.json(images)
})

app.listen(process.env.PORT || 5000, process.env.IP, ()=> {
  console.log('Server running')
})

module.exports = app;