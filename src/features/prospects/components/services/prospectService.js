import API from "./api";

// ===============================
// GET ALL PROSPECTS
// ===============================
export const getProspects = async () => {
  const { data } = await API.get("/api/prospects");
  return data;
};

// ===============================
// GET ONE PROSPECT
// ===============================
export const getProspectById = async (id) => {
  const { data } = await API.get(`/api/prospects/${id}`);
  return data;
};

// ===============================
// ADD PROSPECT
// ===============================
export const createProspect = async (prospect) => {
  const { data } = await API.post("/api/prospects", prospect);
  return data;
};

// ===============================
// UPDATE PROSPECT
// ===============================
export const updateProspect = async (id, prospect) => {
  const { data } = await API.put(`/api/prospects/${id}`, prospect);
  return data;
};

// ===============================
// DELETE PROSPECT
// ===============================
export const deleteProspect = async (id) => {
  const { data } = await API.delete(`/api/prospects/${id}`);
  return data;
};

// ===============================
// CONVERT TO LEAD
// ===============================
export const convertToLead = async (id) => {
  const { data } = await API.post(`/api/prospects/${id}/convert`);
  return data;
};