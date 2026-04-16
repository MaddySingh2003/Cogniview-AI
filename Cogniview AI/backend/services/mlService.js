const axios=require("axios");

async function evaluateText(question,answer,modelAnswer){
    try {
        const res=await axios.post("http://localhost:8000/predict",{
            questions,
            answer,
            model_answer:modelAnswer
        });

        const data=res.data;

        return{
            score:Math.round(data.final_score*10),
            feedback:[`AI:${data.final_label}`],
            confidence:data.confidence

        };


    }catch(err){
        console.error("ML ERROR",err.message);
        return{
            score:5,
            feedback:["Fallback evaluation"]
        };
    }
    
}
module.exports={evaluateText};