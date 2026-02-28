import { DataProvider } from "@refinedev/core";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7201/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const { current = 1, pageSize = 10 } = pagination ?? {};

    const query: any = {
      page: current,
      limit: pageSize,
    };

    // Handle filters
    if (filters) {
      filters.forEach((filter: any) => {
        if (filter.operator === "eq") {
          query[filter.field] = filter.value;
        } else if (filter.operator === "contains") {
          // Map 'contains' filter to 'search' parameter for backend compatibility
          // Most backend endpoints use 'search' parameter for text search
          query.search = filter.value;
        } else if (filter.operator === "ne") {
          query[`${filter.field}_ne`] = filter.value;
        } else if (filter.operator === "in") {
          query[filter.field] = filter.value.join(",");
        } else if (filter.operator === "gte") {
          query[`${filter.field}_gte`] = filter.value;
        } else if (filter.operator === "lte") {
          query[`${filter.field}_lte`] = filter.value;
        } else if (filter.operator === "gt") {
          query[`${filter.field}_gt`] = filter.value;
        } else if (filter.operator === "lt") {
          query[`${filter.field}_lt`] = filter.value;
        }
      });
    }

    // Handle sorters
    if (sorters && sorters.length > 0) {
      query.sort = sorters[0].field;
      query.order = sorters[0].order;
    }

    // Special handling for orders and reviews - use admin endpoint
    let endpoint = `/${resource}`;
    if (resource === 'orders') {
      endpoint = '/orders/admin/all';
    } else if (resource === 'reviews' || resource === 'product-reviews') {
      endpoint = '/product-reviews/admin/all';
    }

    console.log(`[DataProvider] GET ${endpoint}`, { params: query });
    const { data } = await axiosInstance.get(endpoint, { params: query });
    console.log(`[DataProvider] Response:`, data);

    return {
      data: data.data || [],
      total: data.pagination?.total || 0,
    };
  },

  getOne: async ({ resource, id }) => {
    // For products, include all variants (including inactive) for admin editing
    const params = resource === 'products' ? { includeAll: 'true' } : {};

    // For orders and reviews, use admin endpoint
    let endpoint = `/${resource}/${id}`;
    if (resource === 'orders') {
      endpoint = `/orders/admin/${id}`;
    } else if (resource === 'reviews' || resource === 'product-reviews') {
      endpoint = `/product-reviews/admin/${id}`;
    }

    const { data } = await axiosInstance.get(endpoint, { params });
    return {
      data: data.data,
    };
  },

  create: async ({ resource, variables }) => {
    const { data } = await axiosInstance.post(`/${resource}`, variables);
    return {
      data: data.data,
    };
  },

  update: async ({ resource, id, variables }) => {
    let endpoint = `/${resource}/${id}`;

    if (resource === 'orders') {
      endpoint = `/orders/admin/${id}/status`;
    } else if (resource === 'reviews' || resource === 'product-reviews') {
      // Handle special review actions
      if (variables.action === 'approve') {
        endpoint = `/product-reviews/admin/${id}/approve`;
      } else if (variables.action === 'reply') {
        endpoint = `/product-reviews/admin/${id}/reply`;
      } else {
        endpoint = `/product-reviews/${id}`; // Normal update if any
      }
    }

    const { data } = await axiosInstance.put(endpoint, variables);
    return {
      data: data.data,
    };
  },

  deleteOne: async ({ resource, id }) => {
    let endpoint = `/${resource}/${id}`;
    if (resource === 'reviews' || resource === 'product-reviews') {
      endpoint = `/product-reviews/admin/${id}`;
    }

    const { data } = await axiosInstance.delete(endpoint);
    return {
      data: data.data,
    };
  },

  getApiUrl: () => API_URL,

  // Optional methods
  custom: async ({ url, method, filters, sorters, payload, query, headers }) => {
    let requestUrl = `${API_URL}${url}`;

    const { data } = await axiosInstance({
      url: requestUrl,
      method,
      data: payload,
      params: query,
      headers,
    });

    return { data };
  },
};
