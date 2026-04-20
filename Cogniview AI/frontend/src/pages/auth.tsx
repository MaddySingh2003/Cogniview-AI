export default function Auth() {
  return (
    <div className="flex justify-center items-center h-screen">

      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-[400px]">

        <h2 className="text-2xl mb-6 text-center">Welcome</h2>

        <input placeholder="Email" className="w-full p-2 mb-3 rounded text-black" />
        <input placeholder="Password" type="password" className="w-full p-2 mb-3 rounded text-black" />

        <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
          Login
        </button>

      </div>
    </div>
  );
}