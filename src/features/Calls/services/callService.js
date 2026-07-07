import api from "../../../services/api";

const callService = {
  getCalls: async () => {
    const { data } = await api.get("/api/calls");
    return data;
  },

  createCall: async (payload) => {
    const { data } = await api.post("/api/calls", payload);
    return data;
  },

  updateCall: async (id, payload) => {
    const { data } = await api.put(`/api/calls/${id}`, payload);
    return data;
  },

  deleteCall: async (id) => {
    const { data } = await api.delete(`/api/calls/${id}`);
    return data;
  },

  completeCall: async (id, payload = {}) => {
    const { data } = await api.patch(`/api/calls/${id}/complete`, payload);
    return data;
  },
};

export default callService;