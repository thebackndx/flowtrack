import { useState } from "react";
import API from "../api/axios";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await API.post("/auth/login", {
                email,
                password,
            });

            console.log("LOGIN SUCCESS:", res.data);

            window.location.href = "/dashboard"; // 👈 HERE

        } catch (err) {
            console.log("LOGIN ERROR:", err.response?.data || err.message);
        }
    };

    return (
        <div>
            <h2>Login</h2>

            <input
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                placeholder="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>Login</button>
        </div>
    );
}