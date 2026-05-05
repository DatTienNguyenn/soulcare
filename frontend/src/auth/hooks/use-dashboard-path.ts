import { useAuthContext } from './use-auth-context';
import { paths } from 'src/routes/paths';

/**
 * Custom hook to get the appropriate dashboard path based on user role
 * - If user is ADMIN, return admin dashboard
 * - Otherwise, return user dashboard
 */
export const useDashboardPath = () => {
  const { user } = useAuthContext();

  if (!user) {
    return paths.dashboard.root;
  }

  // Check if user is admin
  const isAdmin = user.role === 'ADMIN' || user.role === 'admin';

  return isAdmin ? paths.admin.root : paths.dashboard.root;
};
