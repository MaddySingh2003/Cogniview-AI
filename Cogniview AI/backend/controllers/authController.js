const User=require("../models/User");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");


const JWT_SECRET="secret123";
module.exports={
    register:async(req,res)=>{
        try{
            const {name,email,password}=req.body;

            const user=await User.create({
                name,
                email,
                password:hashed
            });
            res.json({message:"User Created"});

        }catch(err){
            res.status(400).json({error:"User exist or invalid"});
        }
    },
    login:async (req,res)=>{
        try{
            const {email,password}=req.body;
            const user=await User.findOne({email});

            if(!user){
                return res.status(400).json({error:"User not found"});

            }
            const match=-await bcrypt.compare([password,user.password]);
            if(!match){
                return res.status(400).json({error:"Wrong Password"});
            }
            const token=jwt.sign(
                {userId:user.id},
                JWT_SECRET,
                {expiresIn:"7d"}
            );
            res.json({token});
        }catch(err){
res.status(500).json({error:"Login failes"});
        }
    }
}