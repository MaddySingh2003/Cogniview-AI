import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { liveEvaluate, submitAnswer } from "../api/api";

export default function Interview() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(state?.question);
  const [answer, setAnswer] = useState<any>("");
  const [loading, setLoading] = useState(false);

  const [liveScore, setLiveScore] = useState<number | null>(null);
  const [liveFeedback, setLiveFeedback] = useState<string[]>([]);

  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const sessionId = state?.sessionId;

  // ================= LIVE AI =================
  useEffect(() => {
    if (!question) return;

    // Only text-like questions
    if (!["text", "hr"].includes(question.type)) return;

    if (typeof answer !== "string" || answer.trim().length < 5) {
      setLiveScore(null);
      setLiveFeedback([]);
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        const res = await liveEvaluate({
          question: question.question,
          answer,
          modelAnswer: question.modelAnswer
        });

        if (!controller.signal.aborted) {
          setLiveScore(res.data.score);
          setLiveFeedback(res.data.feedback);
        }

      } catch (err) {
        console.error("Live eval error:", err);
      }
    }, 700);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };

  }, [answer, question]);

  // Reset on new question
  useEffect(() => {
    setAnswer("");
    setLiveScore(null);
    setLiveFeedback([]);
  }, [question]);

// ================= VOICE =================
// ================= VOICE =================
const startListening = async () => {
  try {
    if (!recognitionRef.current) return;

    window.speechSynthesis.cancel();

    await navigator.mediaDevices.getUserMedia({
      audio: true
    });

    recognitionRef.current.start();

  } catch (err) {
    console.error("START MIC ERROR:", err);
  }
};

const stopListening = () => {
  try {
    recognitionRef.current?.stop();
  } catch (err) {
    console.error("STOP MIC ERROR:", err);
  }
};
const voiceMode =
  state?.voiceEnabled !== undefined
    ? state.voiceEnabled
    : localStorage.getItem("voiceMode") === "true";

useEffect(() => {
  if (!voiceMode) return;

  const SpeechRecognition =
    (window as any).webkitSpeechRecognition ||
    (window as any).SpeechRecognition;

  if (!SpeechRecognition) {
    console.error("Speech recognition unsupported");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";

  // 🔥 IMPORTANT
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    console.log("🎤 Voice started");
    setListening(true);
  };

  recognition.onresult = (event: any) => {
    let finalTranscript = "";

    for (let i = 0; i < event.results.length; i++) {
      finalTranscript += event.results[i][0].transcript + " ";
    }

    console.log("VOICE:", finalTranscript);

    setAnswer(finalTranscript);
  };

  recognition.onerror = (event: any) => {
    console.error("VOICE ERROR:", event.error);

    // 🔥 Ignore Chrome fake network bug
    if (event.error === "network") {
      return;
    }

    setListening(false);
  };

  recognition.onend = () => {
    console.log("🎤 Voice ended");
    setListening(false);
  };

  recognitionRef.current = recognition;

  return () => {
    recognition.stop();
  };

}, [voiceMode]);

const toggleMic = async () => {
  try {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
      return;
    }

    // mic permission
    await navigator.mediaDevices.getUserMedia({
      audio: true
    });
    window.speechSynthesis.cancel(); 

    // 🔥 IMPORTANT DELAY
    setTimeout(() => {
      recognitionRef.current.start();
    }, 200);

  } catch (err) {
    console.error("MIC ERROR:", err);
  }
};
// ================= AI SPEAK =================
const speakQuestion = (text: string) => {
  if (!voiceMode) return;

  if (!window.speechSynthesis) {
    console.warn("Speech synthesis unsupported");
    return;
  }

  // stop previous speech
  window.speechSynthesis.cancel();

  const speak = () => {
    const voices = window.speechSynthesis.getVoices();

    const utterance = new SpeechSynthesisUtterance(text);

    // better voice
    utterance.voice =
      voices.find((v) => v.lang.includes("en")) || null;

    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      console.log("🔊 AI speaking...");
    };

    utterance.onend = () => {
      console.log("🔊 Speech finished");
    };

    utterance.onerror = (e) => {
      console.error("Speech synthesis error:", e);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Chrome loads voices async
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = speak;
  } else {
    speak();
  }
};useEffect(() => {
  if (!question?.question) return;

  // wait slightly so browser allows audio
  const timer = setTimeout(() => {
    speakQuestion(question.question);
  }, 400);

  return () => {
    clearTimeout(timer);
    window.speechSynthesis.cancel();
  };

}, [question]);
  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (
      !answer ||
      (typeof answer === "string" && answer.trim() === "") ||
      (Array.isArray(answer) && answer.length === 0)
    ) {
      alert("Please provide an answer");
      return;
    }

    try {
      setLoading(true);

      const res = await submitAnswer({
        sessionId,
        answer
      });

      if (res.data.isFinished) {
        navigate("/result", { state: { sessionId } });
      } else {
        setQuestion(res.data.nextQuestion);
      }

    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 bg-[#070B14]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex justify-center items-center px-6 pt-20 relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[#070B14]" />
      <div className="absolute w-[400px] h-[400px] bg-[#E83464]/20 blur-[120px] -top-40 -left-40 rounded-full" />
      <div className="absolute w-[400px] h-[400px] bg-[#8E2DE2]/20 blur-[120px] -bottom-40 -right-40 rounded-full" />

      <div className="relative z-10 w-full max-w-3xl">

        {/* PROGRESS */}
        <div className="mb-6 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-gradient-to-r from-[#E83464] to-[#8E2DE2]" />
        </div>

        {/* CARD */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-xl">

          {/* TAGS */}
          <div className="flex gap-3 mb-6 text-xs flex-wrap">
            <span className="px-3 py-1 bg-purple-500/20 rounded-full">
              {question.type?.toUpperCase()}
            </span>

            <span className="px-3 py-1 bg-pink-500/20 rounded-full">
              {question.difficulty}
            </span>

            <span className="px-3 py-1 bg-white/10 rounded-full">
              {question.topic}
            </span>
          </div>

          {/* HR LABEL */}
          {question.type === "hr" && (
            <div className="mb-4 text-pink-400 text-sm">
              Behavioral Question (STAR recommended)
            </div>
          )}

          {/* QUESTION */}
          <h2 className="text-2xl mb-6 leading-relaxed">
            {question.question}
          </h2>

          {/* TEXT + HR */}
          {(question.type === "text" || question.type === "hr") && (
            <>
              <textarea
                className="w-full p-4 rounded-xl bg-black/40 border border-white/10 
                focus:outline-none focus:ring-2 focus:ring-[#8E2DE2]"
                rows={5}
                placeholder="Write your answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />

              {/* LIVE SCORE */}
              {liveScore !== null && (
                <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Live Score</span>
                    <span
                      className={`font-semibold ${
                        liveScore >= 7
                          ? "text-green-400"
                          : liveScore >= 4
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {liveScore}/10
                    </span>
                  </div>

                  <ul className="text-sm text-gray-300 space-y-1">
                    {liveFeedback.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* VOICE */}
              {voiceMode && (
                <button
  onMouseDown={startListening}
  onMouseUp={stopListening}
  onMouseLeave={stopListening}

  onTouchStart={startListening}
  onTouchEnd={stopListening}

  className={`mt-4 px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
    listening
      ? "bg-red-500 scale-105 shadow-lg shadow-red-500/40"
      : "bg-gradient-to-r from-[#E83464] to-[#8E2DE2]"
  }`}
>
  {listening
    ? "🎙 Release to Stop"
    : "🎤 Hold to Speak"}
</button>
              )}
            </>
          )}

          {/* MCQ */}
          {question.type === "mcq" && (
            <div className="space-y-3">
              {question.options.map((opt: string) => (
                <label key={opt} className="flex gap-3 p-3 bg-white/5 rounded-xl">
                  <input
                    type="radio"
                    checked={answer === opt}
                    onChange={() => setAnswer(opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}

          {/* MSQ */}
          {question.type === "msq" && (
            <div className="space-y-3">
              {question.options.map((opt: string) => (
                <label key={opt} className="flex gap-3 p-3 bg-white/5 rounded-xl">
                  <input
                    type="checkbox"
                    checked={answer?.includes(opt)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setAnswer((prev: any) => [...(prev || []), opt]);
                      } else {
                        setAnswer((prev: any) =>
                          prev.filter((x: string) => x !== opt)
                        );
                      }
                    }}
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}

          {/* CODE */}
          {question.type === "code" && (
            <textarea
              rows={8}
              className="w-full p-4 rounded-xl bg-black/60 font-mono border border-white/10"
              placeholder="Write your code..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          )}

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-8 py-3 rounded-full bg-gradient-to-r from-[#E83464] to-[#8E2DE2]"
          >
            {loading ? "Evaluating..." : "Submit Answer →"}
          </button>

        </div>
      </div>
    </div>
  );
}