export const parseError = (error) => {
  if (!error) return 'Something went wrong.';
  return error?.response?.data?.message || error?.message || 'Something went wrong.';
};