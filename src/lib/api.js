// API utility functions for admin panel

const API_BASE_URL = "/api";

// Generic API call function
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
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
    console.error("API call failed:", error);
    throw error;
  }
}




// Generic CRUD operations for future modules
export const createCRUDAPI = (resource) => ({
  getAll: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    const endpoint = `/${resource}${queryString ? `?${queryString}` : ""}`;
    return apiCall(endpoint);
  },

  getById: (id) => apiCall(`/${resource}/${id}`),

  create: (data) =>
    apiCall(`/${resource}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiCall(`/${resource}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiCall(`/${resource}/${id}`, {
      method: "DELETE",
    }),
});

// Staff API functions
export const staffAPI = {
  // Get all staff with pagination and search
  getStaff: async (params = {}) => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page);
    if (params.limit) searchParams.append("limit", params.limit);
    if (params.search) searchParams.append("search", params.search);
    if (params.role) searchParams.append("role", params.role);
    if (params.department) searchParams.append("department", params.department);

    const queryString = searchParams.toString();
    const endpoint = `/staff${queryString ? `?${queryString}` : ""}`;

    return apiCall(endpoint);
  },

  // Get single staff member by ID
  getStaffMember: async (id) => {
    return apiCall(`/staff/${id}`);
  },

  // Create new staff member
  createStaff: async (staffData) => {
    return apiCall("/staff", {
      method: "POST",
      body: JSON.stringify(staffData),
    });
  },

  // Update staff member
  updateStaff: async (id, staffData) => {
    return apiCall(`/staff/${id}`, {
      method: "PUT",
      body: JSON.stringify(staffData),
    });
  },

  // Delete staff member
  deleteStaff: async (id) => {
    return apiCall(`/staff/${id}`, {
      method: "DELETE",
    });
  },

  // Get staff roles
  getRoles: () => {
    return {
      leader: "หัวหน้า",
      coleader: "รองหัวหน้า",
      employee: "พนักงาน",
      employee_c1: "พนักงาน C1",
      employee_c2: "พนักงาน C2",
      employee_c3: "พนักงาน C3",
      employee_c4: "พนักงาน C4",
      employee_c5: "พนักงาน C5",
      employee_c6: "พนักงาน C6",
      employee_c7: "พนักงาน C7",
      employee_c8: "พนักงาน C8",
      employee_c9: "พนักงาน C9",
      employee_c10: "พนักงาน C10",
    };
  },
};

// Performance Results Types API functions
export const perfResultsTypesAPI = {
  // Get all performance results types with pagination and search
  getTypes: async (params = {}) => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page);
    if (params.limit) searchParams.append("limit", params.limit);
    if (params.search) searchParams.append("search", params.search);
    if (params.withSections)
      searchParams.append("withSections", params.withSections);

    const queryString = searchParams.toString();
    const endpoint = `/perf-results-types${
      queryString ? `?${queryString}` : ""
    }`;

    return apiCall(endpoint);
  },

  // Get single performance results type by ID
  getType: async (id, withSections = false) => {
    const params = withSections ? "?withSections=true" : "";
    return apiCall(`/perf-results-types/${id}${params}`);
  },

  // Create new performance results type
  createType: async (typeData) => {
    return apiCall("/perf-results-types", {
      method: "POST",
      body: JSON.stringify(typeData),
    });
  },

  // Update performance results type
  updateType: async (id, typeData) => {
    return apiCall(`/perf-results-types/${id}`, {
      method: "PUT",
      body: JSON.stringify(typeData),
    });
  },

  // Delete performance results type
  deleteType: async (id) => {
    return apiCall(`/perf-results-types/${id}`, {
      method: "DELETE",
    });
  },
};

// Performance Results Sections API functions
export const perfResultsSectionsAPI = {
  getSections: async (params = {}) => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page);
    if (params.limit) searchParams.append("limit", params.limit);
    if (params.search) searchParams.append("search", params.search);
    if (params.typeId) searchParams.append("typeId", params.typeId);
    if (params.withSubTopics)
      searchParams.append("withSubTopics", params.withSubTopics);

    const queryString = searchParams.toString();
    const endpoint = `/perf-results-sections${
      queryString ? `?${queryString}` : ""
    }`;

    return apiCall(endpoint);
  },

  getSection: async (id, withSubTopics = false) => {
    const params = withSubTopics ? "?withSubTopics=true" : "";
    return apiCall(`/perf-results-sections/${id}${params}`);
  },

  createSection: async (sectionData) => {
    return apiCall("/perf-results-sections", {
      method: "POST",
      body: JSON.stringify(sectionData),
    });
  },

  updateSection: async (id, sectionData) => {
    return apiCall(`/perf-results-sections/${id}`, {
      method: "PUT",
      body: JSON.stringify(sectionData),
    });
  },

  deleteSection: async (id) => {
    return apiCall(`/perf-results-sections/${id}`, {
      method: "DELETE",
    });
  },
};

// Performance Results Sub Topics API functions
export const perfResultsSubTopicsAPI = {
  getSubTopics: async (params = {}) => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page);
    if (params.limit) searchParams.append("limit", params.limit);
    if (params.search) searchParams.append("search", params.search);
    if (params.sectionId) searchParams.append("sectionId", params.sectionId);
    if (params.withFiles) searchParams.append("withFiles", params.withFiles);

    const queryString = searchParams.toString();
    const endpoint = `/perf-results-sub-topics${
      queryString ? `?${queryString}` : ""
    }`;

    return apiCall(endpoint);
  },

  getSubTopic: async (id, withFiles = false) => {
    const params = withFiles ? "?withFiles=true" : "";
    return apiCall(`/perf-results-sub-topics/${id}${params}`);
  },

  createSubTopic: async (subTopicData) => {
    return apiCall("/perf-results-sub-topics", {
      method: "POST",
      body: JSON.stringify(subTopicData),
    });
  },

  updateSubTopic: async (id, subTopicData) => {
    return apiCall(`/perf-results-sub-topics/${id}`, {
      method: "PUT",
      body: JSON.stringify(subTopicData),
    });
  },

  deleteSubTopic: async (id) => {
    return apiCall(`/perf-results-sub-topics/${id}`, {
      method: "DELETE",
    });
  },
};

// Performance Results Files API functions
export const perfResultsFilesAPI = {
  getFiles: async (params = {}) => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page);
    if (params.limit) searchParams.append("limit", params.limit);
    if (params.search) searchParams.append("search", params.search);
    if (params.subTopicId) searchParams.append("subTopicId", params.subTopicId);
    if (params.filesType) searchParams.append("filesType", params.filesType);

    const queryString = searchParams.toString();
    const endpoint = `/perf-results-files${
      queryString ? `?${queryString}` : ""
    }`;

    return apiCall(endpoint);
  },

  getFile: async (id) => {
    return apiCall(`/perf-results-files/${id}`);
  },

  createFile: async (fileData) => {
    return apiCall("/perf-results-files", {
      method: "POST",
      body: JSON.stringify(fileData),
    });
  },

  updateFile: async (id, fileData) => {
    return apiCall(`/perf-results-files?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(fileData),
    });
  },

  deleteFile: async (id) => {
    return apiCall(`/perf-results-files?id=${id}`, {
      method: "DELETE",
    });
  },
};

// ITA Evaluations API functions
export const itaEvaluationsAPI = {
  getEvaluations: async (params = {}) => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page);
    if (params.limit) searchParams.append("limit", params.limit);
    if (params.search) searchParams.append("search", params.search);
    if (params.withContents)
      searchParams.append("withContents", params.withContents);

    const queryString = searchParams.toString();
    const endpoint = `/ita-evaluations${queryString ? `?${queryString}` : ""}`;

    return apiCall(endpoint);
  },

  getEvaluation: async (id, withContents = false) => {
    const params = withContents ? "?withContents=true" : "";
    return apiCall(`/ita-evaluations/${id}${params}`);
  },

  createEvaluation: async (evaluationData) => {
    return apiCall("/ita-evaluations", {
      method: "POST",
      body: JSON.stringify(evaluationData),
    });
  },

  updateEvaluation: async (id, evaluationData) => {
    return apiCall(`/ita-evaluations/${id}`, {
      method: "PUT",
      body: JSON.stringify(evaluationData),
    });
  },

  deleteEvaluation: async (id) => {
    return apiCall(`/ita-evaluations/${id}`, {
      method: "DELETE",
    });
  },
};

// ITA Contents API functions
export const itaContentsAPI = {
  getContents: async (params = {}) => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page);
    if (params.limit) searchParams.append("limit", params.limit);
    if (params.search) searchParams.append("search", params.search);
    if (params.evaluationId)
      searchParams.append("evaluationId", params.evaluationId);

    const queryString = searchParams.toString();
    const endpoint = `/ita-contents${queryString ? `?${queryString}` : ""}`;

    return apiCall(endpoint);
  },

  getContent: async (id) => {
    return apiCall(`/ita-contents/${id}`);
  },

  createContent: async (contentData) => {
    return apiCall("/ita-contents", {
      method: "POST",
      body: JSON.stringify(contentData),
    });
  },

  updateContent: async (id, contentData) => {
    return apiCall(`/ita-contents/${id}`, {
      method: "PUT",
      body: JSON.stringify(contentData),
    });
  },

  deleteContent: async (id) => {
    return apiCall(`/ita-contents/${id}`, {
      method: "DELETE",
    });
  },
};

// Create ITA Tables API
export const createItaTablesAPI = {
  createTables: async () => {
    return apiCall("/create-ita-tables", {
      method: "POST",
    });
  },

  checkTables: async () => {
    return apiCall("/create-ita-tables");
  },
};

// Post Types API functions
export const postTypesAPI = {
  getPostTypes: async (params = {}) => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page);
    if (params.limit) searchParams.append("limit", params.limit);
    if (params.search) searchParams.append("search", params.search);
    if (params.withDetails)
      searchParams.append("withDetails", params.withDetails);

    const queryString = searchParams.toString();
    const endpoint = `/post-types${queryString ? `?${queryString}` : ""}`;

    return apiCall(endpoint);
  },

  getPostType: async (id, withDetails = false) => {
    const params = withDetails ? "?withDetails=true" : "";
    return apiCall(`/post-types/${id}${params}`);
  },

  createPostType: async (postTypeData) => {
    return apiCall("/post-types", {
      method: "POST",
      body: JSON.stringify(postTypeData),
    });
  },

  updatePostType: async (id, postTypeData) => {
    return apiCall(`/post-types/${id}`, {
      method: "PUT",
      body: JSON.stringify(postTypeData),
    });
  },

  deletePostType: async (id) => {
    return apiCall(`/post-types/${id}`, {
      method: "DELETE",
    });
  },
};

// Post Details API functions
export const postDetailsAPI = {
  getPostDetails: async (params = {}) => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page);
    if (params.limit) searchParams.append("limit", params.limit);
    if (params.search) searchParams.append("search", params.search);
    if (params.postTypeId) searchParams.append("postTypeId", params.postTypeId);
    if (params.withMedia) searchParams.append("withMedia", params.withMedia);

    const queryString = searchParams.toString();
    const endpoint = `/post-details${queryString ? `?${queryString}` : ""}`;

    return apiCall(endpoint);
  },

  getPostDetail: async (id, withMedia = false) => {
    const params = withMedia ? "?withMedia=true" : "";
    return apiCall(`/post-details/${id}${params}`);
  },

  createPostDetail: async (postDetailData) => {
    return apiCall("/post-details", {
      method: "POST",
      body: JSON.stringify(postDetailData),
    });
  },

  updatePostDetail: async (id, postDetailData) => {
    return apiCall(`/post-details/${id}`, {
      method: "PUT",
      body: JSON.stringify(postDetailData),
    });
  },

  deletePostDetail: async (id) => {
    return apiCall(`/post-details/${id}`, {
      method: "DELETE",
    });
  },
};

// Create Post Tables API
export const createPostTablesAPI = {
  createTables: async () => {
    return apiCall("/create-post-tables", {
      method: "POST",
    });
  },

  checkTables: async () => {
    return apiCall("/create-post-tables");
  },
};

// Procurement Plan Types API functions
export const procurementPlanTypesAPI = {
  getTypes: async (params = {}) => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page);
    if (params.limit) searchParams.append("limit", params.limit);
    if (params.search) searchParams.append("search", params.search);
    if (params.withFiles) searchParams.append("withFiles", params.withFiles);

    const queryString = searchParams.toString();
    const endpoint = `/procurement-plan-types${queryString ? `?${queryString}` : ""}`;

    return apiCall(endpoint);
  },

  getType: async (id, withFiles = false) => {
    const params = withFiles ? "?withFiles=true" : "";
    return apiCall(`/procurement-plan-types/${id}${params}`);
  },

  createType: async (typeData) => {
    return apiCall("/procurement-plan-types", {
      method: "POST",
      body: JSON.stringify(typeData),
    });
  },

  updateType: async (id, typeData) => {
    return apiCall(`/procurement-plan-types/${id}`, {
      method: "PUT",
      body: JSON.stringify(typeData),
    });
  },

  deleteType: async (id) => {
    return apiCall(`/procurement-plan-types/${id}`, {
      method: "DELETE",
    });
  },
};

// Procurement Plan Files API functions
export const procurementPlanFilesAPI = {
  getFiles: async (params = {}) => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page);
    if (params.limit) searchParams.append("limit", params.limit);
    if (params.search) searchParams.append("search", params.search);
    if (params.typeId) searchParams.append("typeId", params.typeId);
    if (params.filesType) searchParams.append("filesType", params.filesType);

    const queryString = searchParams.toString();
    const endpoint = `/procurement-plan-files${queryString ? `?${queryString}` : ""}`;

    return apiCall(endpoint);
  },

  getFile: async (id) => {
    return apiCall(`/procurement-plan-files/${id}`);
  },

  createFile: async (fileData) => {
    return apiCall("/procurement-plan-files", {
      method: "POST",
      body: JSON.stringify(fileData),
    });
  },

  updateFile: async (id, fileData) => {
    return apiCall(`/procurement-plan-files?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(fileData),
    });
  },

  deleteFile: async (id) => {
    return apiCall(`/procurement-plan-files?id=${id}`, {
      method: "DELETE",
    });
  },
};

// Create Procurement Tables API
export const createProcurementTablesAPI = {
  createTables: async () => {
    return apiCall("/create-procurement-tables", {
      method: "POST",
    });
  },

  checkTables: async () => {
    return apiCall("/create-procurement-tables");
  },
};

// Laws & Regulations Types API functions
export const lawsRegsTypesAPI = {
  getTypes: async (params = {}) => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page);
    if (params.limit) searchParams.append("limit", params.limit);
    if (params.search) searchParams.append("search", params.search);
    if (params.withSections) searchParams.append("withSections", params.withSections);

    const queryString = searchParams.toString();
    const endpoint = `/laws-regs-types${queryString ? `?${queryString}` : ""}`;

    return apiCall(endpoint);
  },

  getType: async (id, withSections = false) => {
    const params = withSections ? "?withSections=true" : "";
    return apiCall(`/laws-regs-types/${id}${params}`);
  },

  createType: async (typeData) => {
    return apiCall("/laws-regs-types", {
      method: "POST",
      body: JSON.stringify(typeData),
    });
  },

  updateType: async (id, typeData) => {
    return apiCall(`/laws-regs-types/${id}`, {
      method: "PUT",
      body: JSON.stringify(typeData),
    });
  },

  deleteType: async (id) => {
    return apiCall(`/laws-regs-types/${id}`, {
      method: "DELETE",
    });
  },
};

// Laws & Regulations Sections API functions
export const lawsRegsSectionsAPI = {
  getSections: async (params = {}) => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page);
    if (params.limit) searchParams.append("limit", params.limit);
    if (params.search) searchParams.append("search", params.search);
    if (params.typeId) searchParams.append("typeId", params.typeId);
    if (params.withFiles) searchParams.append("withFiles", params.withFiles);

    const queryString = searchParams.toString();
    const endpoint = `/laws-regs-sections${queryString ? `?${queryString}` : ""}`;

    return apiCall(endpoint);
  },

  getSection: async (id, withFiles = false) => {
    const params = withFiles ? "?withFiles=true" : "";
    return apiCall(`/laws-regs-sections/${id}${params}`);
  },

  createSection: async (sectionData) => {
    return apiCall("/laws-regs-sections", {
      method: "POST",
      body: JSON.stringify(sectionData),
    });
  },

  updateSection: async (id, sectionData) => {
    return apiCall(`/laws-regs-sections/${id}`, {
      method: "PUT",
      body: JSON.stringify(sectionData),
    });
  },

  deleteSection: async (id) => {
    return apiCall(`/laws-regs-sections/${id}`, {
      method: "DELETE",
    });
  },
};

// Laws & Regulations Files API functions
export const lawsRegsFilesAPI = {
  getFiles: async (params = {}) => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page);
    if (params.limit) searchParams.append("limit", params.limit);
    if (params.search) searchParams.append("search", params.search);
    if (params.sectionId) searchParams.append("sectionId", params.sectionId);
    if (params.filesType) searchParams.append("filesType", params.filesType);

    const queryString = searchParams.toString();
    const endpoint = `/laws-regs-files${queryString ? `?${queryString}` : ""}`;

    return apiCall(endpoint);
  },

  getFile: async (id) => {
    return apiCall(`/laws-regs-files/${id}`);
  },

  createFile: async (fileData) => {
    return apiCall("/laws-regs-files", {
      method: "POST",
      body: JSON.stringify(fileData),
    });
  },

  updateFile: async (id, fileData) => {
    return apiCall(`/laws-regs-files?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(fileData),
    });
  },

  deleteFile: async (id) => {
    return apiCall(`/laws-regs-files?id=${id}`, {
      method: "DELETE",
    });
  },
};

// Create Laws & Regulations Tables API
export const createLawsRegsTablesAPI = {
  createTables: async () => {
    return apiCall("/create-laws-regs-tables", {
      method: "POST",
    });
  },

  checkTables: async () => {
    return apiCall("/create-laws-regs-tables");
  },
};

// Q&A API functions
export const qaAPI = {
  // Categories
  getCategories: async (params = {}) => {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page);
    if (params.limit) searchParams.append('limit', params.limit);
    if (params.search) searchParams.append('search', params.search);
    if (params.withItems) searchParams.append('withItems', params.withItems);
    if (params.activeOnly !== undefined) searchParams.append('activeOnly', params.activeOnly);
    
    const queryString = searchParams.toString();
    const endpoint = `/qa-categories${queryString ? `?${queryString}` : ''}`;
    
    return apiCall(endpoint);
  },

  createCategory: async (categoryData) => {
    return apiCall('/qa-categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  // Q&A Items
  getItems: async (params = {}) => {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page);
    if (params.limit) searchParams.append('limit', params.limit);
    if (params.search) searchParams.append('search', params.search);
    if (params.categoryId) searchParams.append('categoryId', params.categoryId);
    if (params.featuredOnly) searchParams.append('featuredOnly', params.featuredOnly);
    if (params.activeOnly !== undefined) searchParams.append('activeOnly', params.activeOnly);
    
    const queryString = searchParams.toString();
    const endpoint = `/qa-items${queryString ? `?${queryString}` : ''}`;
    
    return apiCall(endpoint);
  },

  createItem: async (itemData) => {
    return apiCall('/qa-items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  incrementView: async (id) => {
    return apiCall(`/qa-items/${id}/view`, {
      method: 'POST',
    });
  },

  // Search
  search: async (query, limit = 10) => {
    const searchParams = new URLSearchParams();
    searchParams.append('q', query);
    searchParams.append('limit', limit);
    
    return apiCall(`/qa-search?${searchParams.toString()}`);
  },

  // Submit new question from citizens
  submitQuestion: async (questionData) => {
    return apiCall('/qa-submit', {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
  },

  // Admin functions
  getPendingItems: async (params = {}) => {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page);
    if (params.limit) searchParams.append('limit', params.limit);
    if (params.search) searchParams.append('search', params.search);
    
    const queryString = searchParams.toString();
    const endpoint = `/qa-pending${queryString ? `?${queryString}` : ''}`;
    
    return apiCall(endpoint);
  },

  getItem: async (id) => {
    return apiCall(`/qa-items/${id}`);
  },

  updateItem: async (id, itemData) => {
    return apiCall(`/qa-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  },

  deleteItem: async (id) => {
    return apiCall(`/qa-items/${id}`, {
      method: 'DELETE',
    });
  },

  // Comments functions
  getComments: async (qaItemId, params = {}) => {
    const searchParams = new URLSearchParams();
    searchParams.append('qa_item_id', qaItemId);
    
    if (params.page) searchParams.append('page', params.page);
    if (params.limit) searchParams.append('limit', params.limit);
    
    return apiCall(`/qa-comments?${searchParams.toString()}`);
  },

  submitComment: async (commentData) => {
    return apiCall('/qa-comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  },
};

// Manual API functions
const manualAPI = {
  // Categories
  getCategories: async (params = {}) => {
    const searchParams = new URLSearchParams();
    
    if (params.activeOnly !== undefined) searchParams.append('activeOnly', params.activeOnly);
    if (params.withItems) searchParams.append('withItems', params.withItems);
    
    const queryString = searchParams.toString();
    const endpoint = `/manual-categories${queryString ? `?${queryString}` : ''}`;
    
    return apiCall(endpoint);
  },

  createCategory: async (categoryData) => {
    return apiCall('/manual-categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  // Manual Items
  getItems: async (params = {}) => {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page);
    if (params.limit) searchParams.append('limit', params.limit);
    if (params.search) searchParams.append('search', params.search);
    if (params.categoryId) searchParams.append('categoryId', params.categoryId);
    if (params.featuredOnly) searchParams.append('featuredOnly', params.featuredOnly);
    if (params.activeOnly !== undefined) searchParams.append('activeOnly', params.activeOnly);
    
    const queryString = searchParams.toString();
    const endpoint = `/manual-items${queryString ? `?${queryString}` : ''}`;
    
    return apiCall(endpoint);
  },

  createItem: async (itemData) => {
    return apiCall('/manual-items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  // Files
  getFiles: async (params = {}) => {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page);
    if (params.limit) searchParams.append('limit', params.limit);
    if (params.search) searchParams.append('search', params.search);
    if (params.manualId) searchParams.append('manualId', params.manualId);
    if (params.filesType) searchParams.append('filesType', params.filesType);
    if (params.activeOnly !== undefined) searchParams.append('activeOnly', params.activeOnly);
    
    const queryString = searchParams.toString();
    const endpoint = `/manual-files${queryString ? `?${queryString}` : ''}`;
    
    return apiCall(endpoint);
  },

  addFile: async (fileData) => {
    return apiCall('/manual-files', {
      method: 'POST',
      body: JSON.stringify(fileData),
    });
  },

  // Search
  search: async (query, params = {}) => {
    const searchParams = new URLSearchParams();
    searchParams.append('q', query);
    
    if (params.limit) searchParams.append('limit', params.limit);
    if (params.categoryId) searchParams.append('categoryId', params.categoryId);
    
    return apiCall(`/manual-search?${searchParams.toString()}`);
  },

  // Upload file
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    }).then(response => response.json());
  },
};

// Export for easy use
const apiExports = {
  staffAPI,
  perfResultsTypesAPI,
  perfResultsSectionsAPI,
  perfResultsSubTopicsAPI,
  perfResultsFilesAPI,
  itaEvaluationsAPI,
  itaContentsAPI,
  createItaTablesAPI,
  postTypesAPI,
  postDetailsAPI,
  createPostTablesAPI,
  procurementPlanTypesAPI,
  procurementPlanFilesAPI,
  createProcurementTablesAPI,
  lawsRegsTypesAPI,
  lawsRegsSectionsAPI,
  lawsRegsFilesAPI,
  createLawsRegsTablesAPI,
  createCRUDAPI,
};

export default apiExports;
