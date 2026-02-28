import axios from 'axios';

let API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7201';
if (typeof window === 'undefined') {
  // SSR within Docker container (bridge network)
  API_URL = process.env.INTERNAL_API_URL || 'http://server:8000';
}
if (!API_URL.endsWith('/api')) {
  API_URL += '/api';
}

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('lp_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('lp_token');
      // window.location.href = '/dang-nhap'; // Optional: Redirect on 401
    }
    return Promise.reject(err);
  }
);

export default api;

// === API Services ===
export const staticPageApi = {
  getBySlug: (slug: string) => api.get(`/static-pages/slug/${slug}`),
};
export const accommodationApi = {
  getAll: (params?: Record<string, unknown>) => api.get('/accommodation', { params }),
  getFeatured: (params?: Record<string, unknown>) => api.get('/accommodation/featured', { params }),
  getById: (id: string) => api.get(`/accommodation/${id}`),
};

export const postApi = {
  getAll: (params?: Record<string, unknown>) => api.get('/posts', { params }),
  getBySlug: (slug: string) => api.get(`/posts/${slug}`),
  getCategories: () => api.get('/posts/categories'),
};

export const videoReviewApi = {
  getAll: (params?: Record<string, unknown>) => api.get('/video-reviews', { params }),
  getBySlug: (slug: string) => api.get(`/video-reviews/${slug}`),
};

export const statsApi = {
  getOverview: () => api.get('/stats/overview'),
};

export const authApi = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: Record<string, unknown>) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data: Record<string, unknown>) => api.post('/auth/reset-password', data),
};

export const bookingApi = {
  create: (data: Record<string, unknown>) => api.post('/bookings', data),
  getMyBookings: (params?: Record<string, unknown>) => api.get('/bookings/me', { params }),
  cancel: (id: string) => api.patch(`/bookings/${id}/cancel`),
};

export const reviewApi = {
  getByAccommodation: (id: string, params?: Record<string, unknown>) => api.get(`/reviews/accommodation/${id}`, { params }),
  create: (data: Record<string, unknown>) => api.post('/reviews', data),
};

export const locationApi = {
  getProvinces: () => api.get('/locations/provinces'),
  getProvinceByCode: (code: string) => api.get(`/locations/provinces/${code}`),
  getWardsByProvince: (code: string) => api.get(`/locations/provinces/${code}/wards`),
};

export const favoriteApi = {
  getMyFavorites: () => api.get('/favorites/me'),
  add: (accommodationId: string) => api.post('/favorites', { accommodationId }),
  remove: (accommodationId: string) => api.delete(`/favorites/${accommodationId}`),
};

export const settingApi = {
  getAll: () => api.get('/settings'),
  getByGroup: (group: string) => api.get(`/settings/group/${group}`),
};

export const contactApi = {
  sendMessage: (data: Record<string, unknown>) => api.post('/contact', data),
};
