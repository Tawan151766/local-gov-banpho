// API utility functions for admin panel

const API_BASE_URL = '/api';

// Generic API call function
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// User API functions
export const userAPI = {
  // Get all users with pagination and search
  getUsers: async (params = {}) => {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page);
    if (params.limit) searchParams.append('limit', params.limit);
    if (params.search) searchParams.append('search', params.search);

    const queryString = searchParams.toString();
    const endpoint = `/users${queryString ? `?${queryString}` : ''}`;
    
    return apiCall(endpoint);
  },

  // Get single user by ID
  getUser: async (id) => {
    return apiCall(`/users/${id}`);
  },

  // Create new user
  createUser: async (userData) => {
    return apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Update user
  updateUser: async (id, userData) => {
    return apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Delete user
  deleteUser: async (id) => {
    return apiCall(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// Generic CRUD operations for future modules
export const createCRUDAPI = (resource) => ({
  getAll: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    const endpoint = `/${resource}${queryString ? `?${queryString}` : ''}`;
    return apiCall(endpoint);
  },

  getById: (id) => apiCall(`/${resource}/${id}`),

  create: (data) => apiCall(`/${resource}`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id, data) => apiCall(`/${resource}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (id) => apiCall(`/${resource}/${id}`, {
    method: 'DELETE',
  }),
});

// Staff API functions
export const staffAPI = {
  // Get all staff with pagination and search
  getStaff: async (params = {}) => {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page);
    if (params.limit) searchParams.append('limit', params.limit);
    if (params.search) searchParams.append('search', params.search);
    if (params.role) searchParams.append('role', params.role);
    if (params.department) searchParams.append('department', params.department);

    const queryString = searchParams.toString();
    const endpoint = `/staff${queryString ? `?${queryString}` : ''}`;
    
    return apiCall(endpoint);
  },

  // Get single staff member by ID
  getStaffMember: async (id) => {
    return apiCall(`/staff/${id}`);
  },

  // Create new staff member
  createStaff: async (staffData) => {
    return apiCall('/staff', {
      method: 'POST',
      body: JSON.stringify(staffData),
    });
  },

  // Update staff member
  updateStaff: async (id, staffData) => {
    return apiCall(`/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(staffData),
    });
  },

  // Delete staff member
  deleteStaff: async (id) => {
    return apiCall(`/staff/${id}`, {
      method: 'DELETE',
    });
  },

  // Get staff roles
  getRoles: () => {
    return {
      'leader': 'หัวหน้า',
      'coleader': 'รองหัวหน้า',
      'employee': 'พนักงาน',
      'employee_c1': 'พนักงาน C1',
      'employee_c2': 'พนักงาน C2',
      'employee_c3': 'พนักงาน C3',
      'employee_c4': 'พนักงาน C4',
      'employee_c5': 'พนักงาน C5',
      'employee_c6': 'พนักงาน C6',
      'employee_c7': 'พนักงาน C7',
      'employee_c8': 'พนักงาน C8',
      'employee_c9': 'พนักงาน C9',
      'employee_c10': 'พนักงาน C10',
    };
  },
};

// Export for easy use
export default {
  userAPI,
  staffAPI,
  createCRUDAPI,
};