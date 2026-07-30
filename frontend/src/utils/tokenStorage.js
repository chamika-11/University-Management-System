/**
 * tokenStorage.js
 * In-memory access token storage — prevents XSS from reading localStorage.
 * The access token lives strictly within this module variable in JS memory.
 */

let _accessToken = null;

export const tokenStorage = {
  get: () => _accessToken,
  set: (token) => { _accessToken = token; },
  clear: () => { _accessToken = null; },
};
