// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    diary: `${ROOTS.DASHBOARD}/diary`,
    canvas: `${ROOTS.DASHBOARD}/canvas`,
    'self-test': `${ROOTS.DASHBOARD}/self-test`,
    'self-test-history': `${ROOTS.DASHBOARD}/self-test/history`,
    analytics: {
      root: `${ROOTS.DASHBOARD}/analytics`,
    },
  },
  // ADMIN
  admin: {
    root: ROOTS.ADMIN,
    testManagement: `${ROOTS.ADMIN}/test-management`,
    userManagement: `${ROOTS.ADMIN}/user-management`,
    analytics: `${ROOTS.ADMIN}/analytics`,
  },
};
