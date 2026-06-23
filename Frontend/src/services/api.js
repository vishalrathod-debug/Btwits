import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// ✅ Register API
export const registerUser = async (data) => {
    const res = await API.post("/api/users/register", data);
    return res.data;
};

// ✅ Login API
export const loginUser = async (data) => {
    const res = await API.post("/api/users/login", data);
    return res.data;
};
export const getUser = async (id) => {
  const res = await API.get(`/api/users/${id}`);
  return res.data;
};