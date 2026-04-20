import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4">

      <h1 className="text-2xl font-bold">FlowTrack</h1>
      <p className="text-gray-500">Track your income & expenses</p>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={() => navigate("/login")}
      >
        Get Started
      </button>

    </div>
  );
}