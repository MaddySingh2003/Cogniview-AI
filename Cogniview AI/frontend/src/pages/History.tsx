import { useEffect,useState } from "react";
import { getHistory } from "../api/api";
import { useNavigate } from "react-router-dom";


export default function History(){
    const [data,setData]=useState<any[]>([]);
    const navigate=useNavigate();

    useEffect(()=>{
        getHistory().then(res=>setData(res.data));
    },[]);
    return (
    <div className="p-10 max-w-3xl mx-auto">

      <h2 className="text-3xl mb-6">Previous Interviews</h2>

      {data.map((s, i) => (
        <div
          key={i}
          className="bg-white/10 p-4 rounded-lg mb-3 cursor-pointer"
          onClick={() =>
            navigate("/result", {
              state: { sessionId: s.sessionId }
            })
          }
        >
          <p>{s.role} - {s.level}</p>
          <p className="text-sm text-gray-400">
            {new Date(s.createdAt).toLocaleString()}
          </p>
        </div>
      ))}

    </div>
  );
}