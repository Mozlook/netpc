export const API_PATHS = {
  auth: {
    register: "/api/auth/register",
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
  },
  contacts: {
    base: "/api/contact",
    byId: (id: string | number) => `/api/contact/${id}`,
  },
  dictionary: {
    categories: "/api/category",
    subcategories: "/api/subcategory",
  },
} as const;
