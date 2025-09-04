import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true
});

export default api;
//We use Axios mainly because it makes working with HTTP requests in frontend & backend easier than using the raw fetch API