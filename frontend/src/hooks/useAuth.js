import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutAction, setCredentials } from '../app/store';
import { clearToken, setToken } from '../utils/tokenStorage';

export function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const login = (payload) => {
    setToken(payload.accessToken);
    dispatch(setCredentials(payload));
  };

  const logout = () => {
    clearToken();
    dispatch(logoutAction());
  };

  return { ...auth, login, logout };
}