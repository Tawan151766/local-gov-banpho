// Image utility functions

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload/image', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Upload failed');
  }
  
  return result.data;
};

export const deleteImage = async (filename) => {
  if (!filename) return;
  
  // Extract filename from URL if it's a full URL
  const actualFilename = filename.includes('/') 
    ? filename.split('/').pop() 
    : filename;

  const response = await fetch(`/api/upload/delete?filename=${actualFilename}`, {
    method: 'DELETE',
  });

  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Delete failed');
  }
  
  return result;
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
    return imagePath;
  }
  
  // Otherwise, construct the URL
  return `/assets/image/${imagePath}`;
};

export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
  }

  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum 5MB allowed.');
  }

  return true;
};