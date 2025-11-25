import axios,{AxiosInstance, InternalAxiosRequestConfig, AxiosError} from "axios";
import { config } from "../config/config";
import Cookies from "js-cookie";
const token = Cookies.get("accessToken"); // Retrieve token from cookies

const axiosInstance = axios.create({
  baseURL: config.BASE_URL, // Your backend base URL
  headers: {
    "Content-Type": "multipart/form-data",
    //  'ngrok-skip-browser-warning': 'true'

  },
});
export const axiosInstanceJson = axios.create({
  baseURL: config.BASE_URL, // Your backend base URL
  headers: {
    "Content-Type": "application/json",
    //  'ngrok-skip-browser-warning': 'true'
    Authorization: `Bearer ${token}`,
  },
});

const attachTokenInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = Cookies.get("accessToken");

      // Retain existing headers
      // config.headers.set("ngrok-skip-browser-warning", "true");

      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        config.headers.delete("Authorization");
      }

      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );
};



// Attach interceptor to both instances
attachTokenInterceptor(axiosInstance);
attachTokenInterceptor(axiosInstanceJson);
// export const setAuthToken = () => { 

//   if (token) {
//     axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     axiosInstanceJson.defaults.headers.common[
//       "Authorization"
//     ] = `Bearer ${token}`;
//     axiosInstanceJson.defaults.headers.common[
//       "ngrok-skip-browser-warning"
//     ] = `true`; 
//   } else {
//     delete axiosInstance.defaults.headers.common["Authorization"];
//     delete axiosInstanceJson.defaults.headers.common["Authorization"];
//   }
// };
 
// setAuthToken();
export default axiosInstance;
