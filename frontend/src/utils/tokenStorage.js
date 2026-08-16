let token = null;

export const getToken = () => token;
export const setToken = (nextToken) => {
  token = nextToken;
};
export const clearToken = () => {
  token = null;
};