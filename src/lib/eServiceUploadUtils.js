// E-Service specific file upload utility functions
// This uses the local Next.js upload API instead of external Laravel API

export const uploadFileToServer = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Upload failed');
  }

  return {
    success: true,
    name: file.name,
    path: result.data.url, // Use the URL as path for local files
    type: getFileTypeFromName(file.name),
    size: file.size,
    url: result.data.url,
    file_url: result.data.url,
    originalName: result.data.originalName
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

export const validateFileType = (file, allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.gif', '.webp']) => {
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  
  if (!allowedTypes.includes(fileExtension)) {
    throw new Error(`ประเภทไฟล์ ${file.name} ไม่ถูกต้อง อนุญาตเฉพาะ: ${allowedTypes.join(', ')}`);
  }
  return true;
};

export const validateFiles = (files, maxSize = 5 * 1024 * 1024, allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.gif', '.webp']) => {
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
  
  // For local files, they should already be in the correct format
  return path;
};

// Enhanced upload function with progress callback
export const uploadFileWithProgress = async (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        if (onProgress) {
          onProgress(percentComplete);
        }
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const result = JSON.parse(xhr.responseText);
          if (result.success) {
            resolve({
              success: true,
              name: file.name,
              path: result.data.url,
              type: getFileTypeFromName(file.name),
              size: file.size,
              url: result.data.url,
              file_url: result.data.url,
              originalName: result.data.originalName
            });
          } else {
            reject(new Error(result.error || 'Upload failed'));
          }
        } catch (error) {
          reject(new Error('Invalid response from server'));
        }
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  });
};