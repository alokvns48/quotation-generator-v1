import axios from "axios";

let accessToken = "";
let unauthorizedHandler = null;

export const setAccessToken = (token) => {
  accessToken = token || "";
};

export const getAccessToken = () => accessToken;

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

export const api = axios.create({
  baseURL: "",
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: "",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await refreshClient.post("/api/auth/refresh");
        setAccessToken(data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken("");
        if (typeof unauthorizedHandler === "function") {
          unauthorizedHandler();
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
