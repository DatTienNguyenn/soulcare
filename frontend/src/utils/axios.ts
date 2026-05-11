import axios, { AxiosRequestConfig } from 'axios';

import { HOST_API, ASSETS_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// Assets API Instance
// ----------------------------------------------------------------------

export const assetAxiosInstance = axios.create({ baseURL: ASSETS_API });

assetAxiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// Asset Fetcher
// ----------------------------------------------------------------------

export const assetFetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await assetAxiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/v1/users/me',
    login: '/api/auth/login',
    register: '/api/auth/register',
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
