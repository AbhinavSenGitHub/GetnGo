// tokenService.js

export const SECRET_KEY = 'your-secret-key';

export const getToken = () => {
  return localStorage.getItem(SECRET_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(SECRET_KEY, token);
};

export const clearToken = () => {
  localStorage.removeItem(SECRET_KEY);
};
