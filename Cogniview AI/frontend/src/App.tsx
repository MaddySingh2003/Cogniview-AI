import { useState } from "react";
import axios from "axios";

type ResultType = {
  score: number;
  feedback: string;
};

function App() {
  const [answer, setAnswer] = useState<string>("");
  const [result, setResult] = useState<ResultType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const question = "What is overfitting?";

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await axios.post<ResultType>(
        "http://localhost:3001/evaluate",
        { question, answer }
      );
      setResult(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-xl">

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {question}
        </h2>

        <textarea
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write your answer here..."
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Checking..." : "Submit"}
        </button>

        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <h3 className="text-lg font-semibold text-green-600">
              Score: {result.score}
            </h3>
            <p className="text-gray-700 mt-2">
              {result.feedback}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;