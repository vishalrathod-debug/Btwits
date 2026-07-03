import axios from "axios";

// 🔥 BASE INSTANCE
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// 🔐 AUTO TOKEN
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//
// 👤 AUTH APIs
//
export const registerUser = async (data) => {
  const res = await API.post("/api/users/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await API.post("/api/users/login", data);
  return res.data;
};

export const getMe = async () => {
  const res = await API.get("/api/users/me");
  return res.data;
};

export const getUser = async (id) => {
  const res = await API.get(`/api/users/${id}`);
  return res.data;
};

export const updateUser = async (formData) => {
  const res = await API.put("/api/users/update", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

//
// 📝 POSTS APIs
//
export const getAllPosts = async (page = 1, limit = 10) => {
  const res = await API.get(`/api/posts?page=${page}&limit=${limit}`);
  return res.data;
};

export const createPost = async (formData) => {
  const res = await API.post("/api/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.post;
};

export const toggleLike = async (postId) => {
  const res = await API.post(`/api/posts/${postId}/like`);
  return res.data;
};

//
// ❤️ FOLLOW API
//
export const toggleFollow = async (userId) => {
  // ✅ FIXED: Changed prefix from /api/users to /api/posts to match your router setup
  const res = await API.post(`/api/posts/${userId}/follow`);
  return res.data;
};

//
// 💬 COMMENT APIs
//
export const addComment = async (postId, text) => {
  const res = await API.post(`/api/posts/${postId}/comment`, { text });
  return res.data;
};

export const getComments = async (postId) => {
  const res = await API.get(`/api/posts/${postId}/comments`);
  return res.data;
};

export const deleteComment = async (commentId) => {
  // ✅ FIXED: Changed endpoint to match router.delete("/:commentId") inside your posts router
  const res = await API.delete(`/api/posts/${commentId}`);
  return res.data;
};

//
// 👤 USER PROFILE
//
export const getUserProfile = async (userId) => {
  const res = await API.get(`/api/users/profile/${userId}`);
  return res.data;
};