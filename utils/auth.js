import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const setAuthToken = (token, userId) => {
  Cookies.set("token", token, { expires: 1 });
  Cookies.set("userID", userId, { expires: 1 });
};

export const removeAuthToken = () => {
  Cookies.remove("token");
};

export const getUserFromToken = () => {
  const token = Cookies.get("token");
  return token ? jwtDecode(token) : null;
};