import { AuthBindings } from "@refinedev/core";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7201/api";

export interface UserIdentity {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  avatar?: string;
  permissions?: string[];
}

export const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });

      // Allow both ADMIN role users and users with admin permissions
      const userRole = data.data?.user?.role ? data.data.user.role.toUpperCase() : '';
      if (data.status === 200 && (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN')) {
        const token = data.data.tokens?.accessToken;
        localStorage.setItem("token", token);

        // Fetch user permissions if available
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        try {
          const meRes = await axios.get(`${API_URL}/auth/me`);
          if (meRes.data.status === 200) {
            const userData = {
              ...data.data.user,
              permissions: meRes.data.data?.permissions || []
            };
            localStorage.setItem("user", JSON.stringify(userData));
          } else {
            localStorage.setItem("user", JSON.stringify(data.data.user));
          }
        } catch {
          localStorage.setItem("user", JSON.stringify(data.data.user));
        }

        return { success: true, redirectTo: "/" };
      }

      return {
        success: false,
        error: {
          name: "LoginError",
          message: "Admin access required",
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: error.response?.data?.message || "Login failed",
        },
      };
    }
  },

  logout: async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    return { success: true, redirectTo: "/login" };
  },

  check: async () => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return { authenticated: true };
    }
    return { authenticated: false, redirectTo: "/login" };
  },

  getPermissions: async () => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      return parsed.permissions || [];
    }
    return [];
  },

  getIdentity: async (): Promise<UserIdentity | null> => {
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }
    return null;
  },

  onError: async (error) => {
    if (error.status === 401 || error.status === 403) {
      return { logout: true };
    }
    return { error };
  },
};

// Helper functions for permission checking
export const hasPermission = (requiredPermission: string): boolean => {
  const user = localStorage.getItem("user");
  if (!user) return false;

  const parsed = JSON.parse(user);

  // Super admin/admin has all permissions
  const role = parsed.role ? parsed.role.toUpperCase() : '';
  if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
    return true;
  }

  // Check specific permission
  const permissions = parsed.permissions || [];
  return permissions.includes(requiredPermission);
};

export const hasAnyPermission = (requiredPermissions: string[]): boolean => {
  const user = localStorage.getItem("user");
  if (!user) return false;

  const parsed = JSON.parse(user);

  // Super admin/admin has all permissions
  const role = parsed.role ? parsed.role.toUpperCase() : '';
  if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
    return true;
  }

  const permissions = parsed.permissions || [];
  return requiredPermissions.some(p => permissions.includes(p));
};

export const hasAllPermissions = (requiredPermissions: string[]): boolean => {
  const user = localStorage.getItem("user");
  if (!user) return false;

  const parsed = JSON.parse(user);

  // Super admin/admin has all permissions
  const role = parsed.role ? parsed.role.toUpperCase() : '';
  if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
    return true;
  }

  const permissions = parsed.permissions || [];
  return requiredPermissions.every(p => permissions.includes(p));
};
