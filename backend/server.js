import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import shortid from "shortid";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI;

await mongoose.connect(mongoUri);

const urlSchema = new mongoose.Schema({
    originalUrl: {type: String, required: true},
    shortUrl: {type: String, required: true, unique: true}
})

const Url = mongoose.model("Url",urlSchema);

app.post("/api/shorten", async (req,res) => {
    const {originalUrl} = req.body;
    const shortUrl = shortid.generate();
    const newUrl = new Url({originalUrl, shortUrl});
    await newUrl.save();
    res.status(201).json({originalUrl, shortUrl});
});

app.get("/:shortUrl", async (req,res)=>{
    const {shortUrl} = req.params;
    const url = await Url.findOne({shortUrl});

    if(url){
        return res.redirect(url.originalUrl);
    }else{
        return res.status(404).json("Url not found");
    }
});

app.listen(3000, () => console.log(`Server running on port 3000`));