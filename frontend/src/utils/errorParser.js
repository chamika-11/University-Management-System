/**
 * Extracts a user-friendly error message string from Axios or network errors.
 */
export function parseErrorMessage(error, defaultMessage = 'An unexpected error occurred.') {
  if (!error) return defaultMessage;

  if (typeof error === 'string') return error;

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.error) {
    return typeof error.response.data.error === 'string'
      ? error.response.data.error
      : error.response.data.error.message || defaultMessage;
  }

  if (error.message) {
    if (error.message.includes('Network Error')) {
      return 'Network error. Please check your internet connection and try again.';
    }
    return error.message;
  }

  return defaultMessage;
}

export const parseError = parseErrorMessage;
