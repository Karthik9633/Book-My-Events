import API from "../api/axios";

// REGISTER
export const registerUser =
  async (userData) => {

    const response =
      await API.post(
        "/auth/register",
        userData
      );

    return response.data;
};



// LOGIN
export const loginUser =
  async (userData) => {

    const response =
      await API.post(
        "/auth/login",
        userData
      );

    return response.data;
};