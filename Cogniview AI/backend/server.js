const express =require("express");
const cors=require("cors");
const axios=require("axios");


const app =express();
app.use(cors());
app.use(express.json());


app.post("/evaluate",async (req,res)=>{
    const { question,answer}=req.body;

    try{
        const response=await axios.post("http://localhost:5000/evaluate",{
            question,answer,
        });
        res.json(response.data);

    }
    catch(error){
        res.json(500).json({error:"ml service error"});

    }
});


app.listen(3001,()=>console.log("Backend running port 3001"));