import { useMemo, useEffect, useReducer, useCallback } from 'react';

import axios, { endpoints } from 'src/utils/axios';

import { AuthContext } from './auth-context';
import { setSession, isValidToken } from './utils';
import { AuthUserType, ActionMapType, AuthStateType } from '../../types';

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        try {
          const res = await axios.get(endpoints.auth.me);
          const user = res.data?.data;

          dispatch({
            type: Types.INITIAL,
            payload: {
              user: {
                ...user,
                accessToken,
              },
            },
          });
        } catch (error) {
          // If /api/v1/users/me fails, try to decode token to get user info
          console.warn('Failed to fetch user from /api/v1/users/me, using token data', error);

          // Decode JWT to get user info (basic decoding without verification)
          try {
            const base64Url = accessToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map((c) => {
                  return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
            );

            const tokenData = JSON.parse(jsonPayload);
            console.log('Decoded token data:', tokenData);

            dispatch({
              type: Types.INITIAL,
              payload: {
                user: {
                  id: tokenData.sub || tokenData.email || 'unknown',
                  email: tokenData.email || tokenData.sub || 'unknown',
                  displayName: tokenData.name || tokenData.email || 'User',
                  role: tokenData.role || 'PATIENT',
                  photoURL: null,
                  phoneNumber: null,
                  country: null,
                  address: null,
                  state: null,
                  city: null,
                  zipCode: null,
                  company: null,
                  accessToken,
                },
              },
            });
          } catch (decodeError) {
            console.error('Failed to decode token:', decodeError);
            dispatch({
              type: Types.INITIAL,
              payload: {
                user: null,
              },
            });
          }
        }
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(
    async (email: string, password: string, role: string): Promise<string> => {
      const data = {
        email,
        password,
        role,
      };

      const res = await axios.post('http://localhost:8080/api/v1/auth/login', data);

      // Handle new API response format: { code, message, data: { token } }
      const token = res.data.data?.token || res.data.accessToken;
      const message = res.data.message || 'Login successful';

      setSession(token);

      dispatch({
        type: Types.LOGIN,
        payload: {
          user: {
            id: email,
            displayName: email,
            email,
            photoURL: null,
            phoneNumber: null,
            country: null,
            address: null,
            state: null,
            city: null,
            zipCode: null,
            company: null,
            role: role || 'PATIENT',
            accessToken: token,
          },
        },
      });

      return message;
    },
    []
  );

  // REGISTER
  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string,
      role: string
    ): Promise<string> => {
      const data = {
        email,
        password,
        firstName,
        lastName,
        role,
      };

      const res = await axios.post('http://localhost:8080/api/v1/auth/register', data);

      // Handle new API response format: { code, message, data: { token } }
      const token = res.data.data?.token || res.data.accessToken;
      const message = res.data.message || 'User registered successfully';

      sessionStorage.setItem(STORAGE_KEY, token);

      dispatch({
        type: Types.REGISTER,
        payload: {
          user: {
            id: email,
            displayName: `${firstName} ${lastName}`,
            email,
            photoURL: null,
            phoneNumber: null,
            country: null,
            address: null,
            state: null,
            city: null,
            zipCode: null,
            company: null,
            role: role || 'PATIENT',
            accessToken: token,
          },
        },
      });

      return message;
    },
    []
  );

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
