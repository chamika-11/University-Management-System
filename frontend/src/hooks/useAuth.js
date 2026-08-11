import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectIsAuthenticated, selectIsInitializing, logout, setCredentials } from '@/store/authSlice';
import { usePermission } from '@/access-control/usePermission';
import { authClient } from '@/api/authClient';

export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInitializing = useSelector(selectIsInitializing);
  const permissionInfo = usePermission();

  const login = async (credentials) => {
    const data = await authClient.login(credentials);
    if (data && data.data) {
      dispatch(setCredentials({
        accessToken: data.data.accessToken,
        user: data.data.user,
      }));
    }
    return data;
  };

  return {
    user,
    isAuthenticated,
    isInitializing,
    login,
    logout: () => dispatch(logout()),
    ...permissionInfo,
  };
}
