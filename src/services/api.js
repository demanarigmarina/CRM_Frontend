import axios from "axios";

// ── Axios instance used by ALL protected API calls ────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/",
  withCredentials: true,
});
// ── Shared in-memory token store ──────────────────────────────────────────────
let _accessToken = null;
let _onLogout = null; // callback set by AuthContext to clear state + redirect

export const setAccessToken = (token) => {
  _accessToken = token;
};
export const setLogoutCallback = (fn) => {
  _onLogout = fn;
};

// ── Request interceptor: attach access token to every request ─────────────────
api.interceptors.request.use(
  (config) => {
    if (_accessToken) {
      config.headers.Authorization = `Bearer ${_accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor: handle 401 → silent refresh → retry ────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response, // 2xx — pass through

  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/api/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    // If a refresh is already in flight, queue this request until it resolves
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Silent refresh — the httpOnly cookie is sent automatically
      const { data } = await axios.post(
        "/api/auth/refresh",
        {},
        { withCredentials: true },
      );

      const newToken = data.accessToken;
      setAccessToken(newToken);
      processQueue(null, newToken);

      // Retry the original failed request with the new token
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh failed — session is dead
      processQueue(refreshError, null);
      setAccessToken(null);

      if (_onLogout) _onLogout(); // clear React state + redirect to /login

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
