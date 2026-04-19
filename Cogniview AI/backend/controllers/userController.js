const Session=require("../models/Session");

module.exports={
    getHistory:async(req,res)=>{
        try{
            const session=await Session.find({
                userId:req.userId
            }).sort({createdAt:-1});
            res.json(session);
        }catch(err){
            res.status(500).json({error:"Failed to fetch"});
        }
    }
}