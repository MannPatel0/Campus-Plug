import axios from "axios";
const client = axios.create({ baseURL: "http://localhost:3030/api" });
export default client;
