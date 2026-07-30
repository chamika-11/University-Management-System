import { useDispatch } from 'react-redux';
import { showToast as showToastAction, clearToast } from '@/store/uiSlice';

export function useToast() {
  const dispatch = useDispatch();

  const showToast = (toastData) => {
    dispatch(showToastAction(toastData));
  };

  return {
    showToast,
    clearToast: () => dispatch(clearToast()),
  };
}
