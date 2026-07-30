import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectIsAuthenticated, selectIsInitializing, logout } from '@/store/authSlice';
import { usePermission } from '@/access-control/usePermission';

export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInitializing = useSelector(selectIsInitializing);
  const permissionInfo = usePermission();

  return {
    user,
    isAuthenticated,
    isInitializing,
    logout: () => dispatch(logout()),
    ...permissionInfo,
  };
}
