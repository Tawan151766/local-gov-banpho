// File upload utility functions

export const uploadFileToServer = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://banpho.sosmartsolution.com/api/upload-file', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Upload failed');
  }

  // Extract path from full URL
  // https://banpho.sosmartsolution.com/storage/pdf/1752043878_a_250718_162515.pdf
  // becomes: pdf/1752043878_a_250718_162515.pdf
  let fullUrl = result.file_url || result.url;
  
  // Clean up escaped slashes from JSON response
  fullUrl = fullUrl.replace(/\\\//g, '/');
  
  const path = fullUrl.replace('https://banpho.sosmartsolution.com/storage/', '');
  
  return {
    success: true,
    name: file.name,
    path: path,
    type: getFileTypeFromName(file.name),
    size: file.size,
    url: fullUrl,
    file_url: fullUrl // For backward compatibility
  };
};

export const uploadMultipleFiles = async (files) => {
  const uploadPromises = files.map(file => uploadFileToServer(file));
  return Promise.all(uploadPromises);
};

export const getFileTypeFromName = (filename) => {
  if (!filename) return 'unknown';
  const extension = filename.split('.').pop().toLowerCase();
  return extension;
};

export const validateFileSize = (file, maxSize = 5 * 1024 * 1024) => {
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    throw new Error(`ไฟล์ ${file.name} มีขนาดใหญ่เกินไป ขนาดสูงสุด ${maxSizeMB}MB`);
  }
  return true;
};

export const validateFileType = (file, allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']) => {
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  
  if (!allowedTypes.includes(fileExtension)) {
    throw new Error(`ประเภทไฟล์ ${file.name} ไม่ถูกต้อง อนุญาตเฉพาะ: ${allowedTypes.join(', ')}`);
  }
  return true;
};

export const validateFiles = (files, maxSize = 5 * 1024 * 1024, allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']) => {
  for (const file of files) {
    validateFileSize(file, maxSize);
    validateFileType(file, allowedTypes);
  }
  return true;
};

export const getFileUrl = (path) => {
  if (!path) return null;
  
  // If it's already a full URL, return as is
  if (path.startsWith('http')) {
    return path;
  }
  
  // Otherwise, construct the URL
  return `https://banpho.sosmartsolution.com/storage/${path}`;
};