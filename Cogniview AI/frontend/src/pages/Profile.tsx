
import { useEffect, useState } from "react";
import { getHistory } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [history, setHistory] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);

const [editName, setEditName] = useState("");

  const navigate = useNavigate();
  const handleSave = () => {

  const updatedUser = {
    ...user,
    name: editName
  };

  setUser(updatedUser);

  localStorage.setItem(
    "user",
    JSON.stringify(updatedUser)
  );

  setEditing(false);
};

  // ================= LOAD USER =================
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("User parse failed");
    }

    getHistory()
      .then((res) => setHistory(res.data))
      .catch((err) => {
        console.error("History fetch failed", err);
      });

  }, []);

  // ================= STATS =================
  const avg = history.length
    ? (
        history.reduce(
          (a, b) => a + Number(b.averageScore || 0),
          0
        ) / history.length
      ).toFixed(2)
    : "0";

  const best = history.length
    ? Math.max(
        ...history.map((h) =>
          Number(h.averageScore || 0)
        )
      ).toFixed(2)
    : "0";

  // ================= USER DATA =================
  const userName =
    user?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const userEmail =
    user?.email || "No email";

  const initial =
    userName?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="min-h-screen text-white relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[#070B14]" />

      <div className="absolute w-[400px] h-[400px] bg-[#E83464]/20 blur-[120px] rounded-full -top-40 -left-40 animate-pulse" />

      <div className="absolute w-[400px] h-[400px] bg-[#8E2DE2]/20 blur-[120px] rounded-full -bottom-40 -right-40 animate-pulse" />

      <div className="absolute inset-0 opacity-[0.05]
      bg-[linear-gradient(white_1px,transparent_1px),
      linear-gradient(to_right,white_1px,transparent_1px)]
      bg-[size:40px_40px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20">

        {/* HEADER */}
        <div className="mb-14">
          <h1 className="text-4xl font-bold mb-2">
            Profile Overview
          </h1>

          <p className="text-gray-400">
            Your AI interview journey and performance insights
          </p>
        </div>

        {/* TOP */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">

          {/* PROFILE CARD */}
          <FloatingCard delay="0s">

            <div className="p-8 text-center">

              {/* AVATAR */}
              <div
                className="w-20 h-20 rounded-full
                bg-gradient-to-br from-[#E83464] to-[#8E2DE2]
                flex items-center justify-center
                text-2xl font-bold mb-4 mx-auto"
              >
                {initial}
              </div>

              {/* NAME */}
              <h2 className="text-2xl font-semibold">
                {userName}
              </h2>

              {/* EMAIL */}
              <p className="text-gray-400 text-sm mt-2">
                {userEmail}
              </p>

              {/* ROLE */}
              <div
                className="mt-4 inline-flex items-center
                px-4 py-1 rounded-full text-xs
                bg-white/5 border border-white/10"
              >
                AI Interview Candidate
              </div>

              {/* INTERVIEWS */}
              <p className="mt-6 text-gray-400 text-sm">
                Interviews Completed: {history.length}
              </p>

              {/* EDIT MODE */}
{editing ? (

  <div className="mt-6 space-y-3">

    <input
      type="text"
      value={editName}
      onChange={(e) =>
        setEditName(e.target.value)
      }
      className="w-full p-3 rounded-xl
      bg-black/40 border border-white/10
      focus:outline-none"
      placeholder="Enter name"
    />

    <div className="flex gap-3">

      <button
        onClick={handleSave}
        className="flex-1 py-2 rounded-full
        bg-green-500 hover:scale-105 transition"
      >
        Save
      </button>

      <button
        onClick={() => {
          setEditing(false);
          setEditName(userName);
        }}
        className="flex-1 py-2 rounded-full
        bg-white/10 hover:bg-white/20 transition"
      >
        Cancel
      </button>

    </div>

  </div>

) : (

  <button
    onClick={() => setEditing(true)}
    className="mt-6 px-5 py-2 rounded-full text-sm
    bg-gradient-to-r from-[#E83464] to-[#8E2DE2]
    hover:scale-105 transition"
  >
    Edit Profile
  </button>

)}

            </div>

          </FloatingCard>

          {/* STATS */}
          <div className="col-span-2 grid grid-cols-2 gap-6">

            <FloatingCard delay="0.2s">
              <Stat
                title="Average Score"
                value={avg}
              />
            </FloatingCard>

            <FloatingCard delay="0.4s">
              <Stat
                title="Best Score"
                value={best}
              />
            </FloatingCard>

            <FloatingCard delay="0.6s">
              <Stat
                title="Total Sessions"
                value={history.length}
              />
            </FloatingCard>

            <FloatingCard delay="0.8s">
              <Stat
                title="Consistency"
                value={
                  history.length > 10
                    ? "Excellent"
                    : history.length > 3
                    ? "Good"
                    : "Starting"
                }
              />
            </FloatingCard>

          </div>

        </div>

        {/* RECENT INTERVIEWS */}
        <FloatingCard delay="1s">

          <div className="p-6">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-xl font-semibold">
                Recent Interviews
              </h2>

              <button
                onClick={() => navigate("/history")}
                className="text-sm text-pink-400 hover:text-white transition"
              >
                View All →
              </button>

            </div>

            <div className="space-y-4">

              {history.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                  No interview history found
                </div>
              )}

              {history.slice(0, 5).map((h, i) => (

                <div
                  key={i}
                  onClick={() => navigate("/history")}
                  className="cursor-pointer flex justify-between items-center
                  p-4 rounded-xl bg-white/5 hover:bg-white/10 transition"
                >

                  <div>

                    <p className="font-medium capitalize">
                      {h.role} • {h.level}
                    </p>

                    <p className="text-gray-400 text-sm">
                      {new Date(
                        h.createdAt
                      ).toLocaleDateString()}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-green-400 font-semibold text-lg">
                      {Number(
                        h.averageScore || 0
                      ).toFixed(2)}
                    </p>

                    <p className="text-xs text-gray-400">
                      Score
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </FloatingCard>

      </div>

      {/* FLOAT ANIMATION */}
      <style>
        {`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-10px);
          }

          100% {
            transform: translateY(0px);
          }
        }
        `}
      </style>

    </div>
  );
}

/* FLOAT CARD */
function FloatingCard({ children, delay }: any) {
  return (
    <div
      style={{
        animation: `float 6s ease-in-out infinite`,
        animationDelay: delay
      }}
      className="relative p-[1px]
      rounded-2xl
      bg-gradient-to-r
      from-[#E83464]
      to-[#8E2DE2]"
    >
      <div className="bg-[#0B0F1A] rounded-2xl">
        {children}
      </div>
    </div>
  );
}

/* STAT CARD */
function Stat({ title, value }: any) {
  return (
    <div className="p-6 text-center">

      <p className="text-gray-400 text-sm mb-2">
        {title}
      </p>

      <h3 className="text-3xl font-bold">
        {value}
      </h3>

    </div>
  );
}
