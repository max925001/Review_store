import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];
let refreshPromise = null;

export const getRefreshToken = () => {
  if (!refreshPromise) {
    refreshPromise = apiClient.post('/auth/refresh-token')
      .then((res) => {
        refreshPromise = null;
        return res;
      })
      .catch((err) => {
        refreshPromise = null;
        throw err;
      });
  }
  return refreshPromise;
};

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If it's a 401 unauthorized error and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Avoid looping if the login or refresh token calls fail
      if (originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/refresh-token')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue concurrent requests while token is refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to rotate cookies by hitting the refresh-token endpoint
        await getRefreshToken();

        isRefreshing = false;
        processQueue(null);
        
        // Retry the original failed request
        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);
        
        // If refresh fails, session is completely expired. Log out.
        // Trigger page reload to login to clear all SPA states
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }

    // Pass along standard response errors (400, 403, 404, 500, etc.)
    return Promise.reject(error);
  }
);

export default apiClient;
