import axios from "axios";

// This pulls your backend URL (e.g., http://localhost:3000) from your .env file
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// ✅ Fixed: Added /api/users prefix to match backend
export const registerUser = async (data) => {
    const res = await API.post("/api/users/register", data);
    return res.data;
};

// ✅ Fixed: Added /api/users prefix to match backend
export const loginUser = async (data) => {
    const res = await API.post("/api/users/login", data);
    return res.data;
};

// ✅ Fixed: Swapped global 'axios' out for 'API', and corrected endpoint path
export const getMe = async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const res = await API.get("/api/users/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    console.log("data from get me", res)
    return res.data;
};


export const getUser = async (id) => {
    const res = await API.get(`/api/users/${id}`);
    return res.data;
};