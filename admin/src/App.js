import axios from "axios";
import GlobalContextProvider from "./Components/GlobalContextProvider";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.token;
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      window.location.href = "/login";
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default function App() {
  return (
    <div>
      <GlobalContextProvider></GlobalContextProvider>
    </div>
  );
}
