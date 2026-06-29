import axios, { AxiosRequestConfig } from 'axios';

// Get API from Vite env, when production then Vite will replace this with the value in .env.production, when running local (dev) then this will be undefined and axios will use relative path, allowing proxy in vite.config.ts to work.
const API_URL = import.meta.env.VITE_API_URL || '';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: API_URL });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/v1/users/me',
    login: '/api/v1/auth/login',
    register: '/api/v1/auth/register',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  ai: {
    chat: '/api/v1/ai/chat',
  },
  diary: {
    list: '/api/v1/diaries',
    create: '/api/v1/diaries',
    details: (id: string) => `/api/v1/diaries/${id}`,
    update: (id: string) => `/api/v1/diaries/${id}`,
    delete: (id: string) => `/api/v1/diaries/${id}`,
    range: '/api/v1/diaries/range',
    frequency: '/api/v1/diaries/analytics/frequency',
  },
  testResults: {
    list: '/api/v1/test-results',
    create: '/api/v1/test-results',
    details: (id: string) => `/api/v1/test-results/${id}`,
    delete: (id: string) => `/api/v1/test-results/${id}`,
    byTest: (testId: string) => `/api/v1/test-results/test/${testId}`,
    history: '/api/v1/test-results/analytics/history',
  },
};
