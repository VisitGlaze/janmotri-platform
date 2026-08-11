import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

export const loginAdmin = async (loginData) => {
    const response = await axios.post(
        `${API_URL}/login`,
        loginData
    );

    return response.data;
};