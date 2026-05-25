import { useAuthContext } from './use-auth-context';
import { paths } from 'src/routes/paths';

/**
 * Custom hook to get the appropriate dashboard path based on user role
 * - If user is ADMIN, return admin dashboard
 * - If user is SPECIALIST, return specialist dashboard
 * - Otherwise, return user dashboard
 */
export const useDashboardPath = () => {
  const { user } = useAuthContext();

  if (!user) {
    return paths.dashboard.root;
  }

  // Check if user is admin
  const isAdmin = user.role === 'ADMIN' || user.role === 'admin';
  if (isAdmin) {
    return paths.admin.root;
  }

  // Check if user is specialist
  const isSpecialist = user.role === 'SPECIALIST' || user.role === 'specialist';
  if (isSpecialist) {
    return paths.specialist.root;
  }

  // Default to patient dashboard
  return paths.dashboard.root;
};
