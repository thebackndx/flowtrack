import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            setError("");
            await API.post("/auth/login", { email, password });
            navigate("/dashboard");
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Server not responding");
            }
        }
    };

    return (
        <div className="h-screen flex items-center justify-center">

            <div className="bg-white p-6 shadow rounded w-80 space-y-3">

                <h2 className="text-lg font-semibold">Login</h2>

                <input
                    className="border rounded-md px-3 py-2 w-full"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                    }}
                />

                <input
                    type="password"
                    className="border rounded-md px-3 py-2 w-full"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                    }}
                />

                <button
                    className="bg-blue-500 text-white w-full py-2 rounded-md"
                    onClick={handleLogin}
                >
                    Login
                </button>
                {error && (
                    <p className="text-red-500 text-sm text-center">
                        {error}
                    </p>
                )}
                <p className="text-sm text-center">
                    Don’t have an account?{" "}
                    <span
                        className="text-blue-500 cursor-pointer"
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </span>
                </p>

            </div>


        </div>
    );
}