import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const unwrap = (response) => {
  const d = response.data;
  return d?.prospects || d?.prospect || d?.data || d;
};

// ===============================
// GET ALL PROSPECTS
// ===============================
export const getProspects = async () => {
  const response = await API.get("/api/prospects");
  return unwrap(response);
};

// ===============================
// GET ONE PROSPECT
// ===============================
export const getProspectById = async (id) => {
  const response = await API.get(`/api/prospects/${id}`);
  return unwrap(response);
};

// ===============================
// ADD PROSPECT
// ===============================
export const createProspect = async (prospect) => {
  try {
    const response = await API.post("/api/prospects", prospect);
    return unwrap(response);
  } catch (err) {
    console.error("createProspect error:", err.response?.data || err.message || err);
    throw err;
  }
};

// ===============================
// UPDATE PROSPECT
// ===============================
export const updateProspect = async (id, prospect) => {
  const response = await API.put(`/api/prospects/${id}`, prospect);
  return unwrap(response);
};

// ===============================
// DELETE PROSPECT
// ===============================
export const deleteProspect = async (id) => {
  const response = await API.delete(`/api/prospects/${id}`);
  return unwrap(response);
};

// ===============================
// CONVERT TO LEAD
// ===============================
export const convertToLead = async (id) => {
  const response = await API.post(`/api/prospects/${id}/convert`);
  return unwrap(response);
};