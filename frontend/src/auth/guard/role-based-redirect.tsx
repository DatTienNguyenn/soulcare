import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardPath } from 'src/auth/hooks';
import { LoadingScreen } from 'src/components/loading-screen';

/**
 * Component that redirects users to the appropriate dashboard based on their role
 * Shows loading screen while determining the correct path
 */
export const RoleBasedRedirect = () => {
  const navigate = useNavigate();
  const targetPath = useDashboardPath();

  useEffect(() => {
    if (targetPath) {
      navigate(targetPath, { replace: true });
    }
  }, [navigate, targetPath]);

  return <LoadingScreen />;
};
