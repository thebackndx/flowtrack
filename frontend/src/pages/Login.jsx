import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await API.post("/auth/login", { email, password });
            navigate("/dashboard");
        } catch (err) {
            console.log(err.response?.data || err.message);
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
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="border rounded-md px-3 py-2 w-full"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className="bg-blue-500 text-white w-full py-2 rounded-md"
                    onClick={handleLogin}
                >
                    Login
                </button>
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