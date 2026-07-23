import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Request Interceptor: Dynamically attach the latest token on every request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 2. Response Interceptor: Catch 401 errors and refresh the token
apiClient.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark request to prevent infinite loops

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        // Run a request to your API to refresh the token
        // Use a separate axios instance to prevent interceptor loops
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refreshToken },
        );

        const { accessToken } = response.data;

        // Save the new token
        localStorage.setItem("accessToken", accessToken);
        
        // Update the failed request authorization header and retry it
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.log(refreshError);
        // If the refresh token is also expired or invalid, log the user out
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/log-in";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
