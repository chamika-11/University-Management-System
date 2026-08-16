import { useDispatch } from 'react-redux';
import { clearGlobalBanner, setGlobalBanner } from '../app/store';

export function useToast() {
  const dispatch = useDispatch();

  const showToast = (payload) => {
    dispatch(setGlobalBanner(payload));
    window.setTimeout(() => dispatch(clearGlobalBanner()), 2500);
  };

  return { showToast };
}