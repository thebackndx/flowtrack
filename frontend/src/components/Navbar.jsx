import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await API.post("/auth/logout");
        } catch (e) {
            console.log(e);
        }

        navigate("/login");
    };

    return (
        <div className="bg-white shadow px-6 py-3 flex justify-between items-center">

            <h1 className="font-semibold text-lg">FlowTrack</h1>

            <button
                onClick={handleLogout}
                className="text-sm bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
            >
                Logout
            </button>

        </div>
    );
}