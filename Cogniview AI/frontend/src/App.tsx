import { useState } from "react";
import axios from "axios";

function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState<any>("");
  const [result, setResult] = useState<any>(null);
  const [finalResult, setFinalResult] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const startInterview = async () => {
    setLoading(true);
    const res = await axios.post("http://localhost:3001/start");
    setSessionId(res.data.sessionId);
    setQuestions(res.data.questions);
    setCurrentIndex(0);
    setLoading(false);
  };

  const submitAnswer = async () => {
    setLoading(true);

    const res = await axios.post("http://localhost:3001/answer", {
      sessionId,
      questionObj: currentQ,
      answer
    });

    setResult(res.data);

    const next = currentIndex + 1;

    if (next < questions.length) {
      setCurrentIndex(next);
      setAnswer(currentQ.type === "msq" ? [] : "");
    } else {
      const final = await axios.get(
        `http://localhost:3001/result/${sessionId}`
      );

      const analyticsRes = await axios.get(
        `http://localhost:3001/analytics/${sessionId}`
      );

      setFinalResult(final.data);
      setAnalytics(analyticsRes.data);
    }

    setLoading(false);
  };

  // 🔹 Start Screen
  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-xl text-center w-96">
          <h1 className="text-2xl font-bold mb-6 text-white">
            AI Interview
          </h1>
          <button
            onClick={startInterview}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition p-3 rounded-lg font-semibold"
          >
            {loading ? "Starting..." : "Start Interview"}
          </button>
        </div>
      </div>
    );
  }

  // 🔹 Final Screen
  if (finalResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-[450px] text-white">
          <h2 className="text-xl mb-2">Final Score</h2>
          <h1 className="text-4xl font-bold text-green-400 mb-6">
            {finalResult.averageScore}
          </h1>

          <h3 className="mb-2">Topic Performance</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {analytics &&
              Object.entries(analytics.topicPerformance).map(([t, s]) => (
                <span
                  key={t}
                  className="bg-slate-700 px-3 py-1 rounded-full text-sm"
                >
                  {t}: {String(s)}
                </span>
              ))}
          </div>

          <h3 className="mb-2">Weak Areas</h3>
          <div className="flex flex-wrap gap-2">
            {analytics?.weakAreas.map((w: string) => (
              <span
                key={w}
                className="bg-red-700 px-3 py-1 rounded-full text-sm"
              >
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 🔹 Question Screen
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-[500px]">
        
        {/* Progress */}
        <div className="w-full h-2 bg-slate-700 rounded mb-4">
          <div
            className="h-full bg-green-400 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm text-gray-400 mb-2">
          Question {currentIndex + 1} / {questions.length}
        </p>

        <h3 className="text-lg font-semibold mb-4">
          {currentQ?.question}
        </h3>

        {/* TEXT */}
        {currentQ?.type === "text" && (
          <textarea
            className="w-full p-3 rounded-lg bg-slate-700 focus:outline-none"
            placeholder="Type your answer..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        )}

        {/* MCQ */}
        {currentQ?.type === "mcq" &&
          currentQ.options.map((opt: string) => (
            <label
              key={opt}
              className="flex items-center gap-2 bg-slate-700 p-3 rounded-lg mt-2 cursor-pointer hover:bg-slate-600"
            >
              <input
                type="radio"
                name="mcq"
                checked={answer === opt}
                onChange={() => setAnswer(opt)}
              />
              {opt}
            </label>
          ))}

        {/* MSQ */}
        {currentQ?.type === "msq" &&
          currentQ.options.map((opt: string) => (
            <label
              key={opt}
              className="flex items-center gap-2 bg-slate-700 p-3 rounded-lg mt-2 cursor-pointer hover:bg-slate-600"
            >
              <input
                type="checkbox"
                checked={answer.includes(opt)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAnswer([...answer, opt]);
                  } else {
                    setAnswer(answer.filter((a: string) => a !== opt));
                  }
                }}
              />
              {opt}
            </label>
          ))}

        <button
          onClick={submitAnswer}
          disabled={loading || !answer || (Array.isArray(answer) && !answer.length)}
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 transition p-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Answer"}
        </button>

        {result && (
          <p className="mt-3 text-green-400">
            Score: {result.score}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;