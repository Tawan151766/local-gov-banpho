"use client";

import { useState } from "react";
import { Upload, Button, message, Space, Typography, Tag } from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileOutlined,
  LinkOutlined
} from "@ant-design/icons";

const { Text } = Typography;

export default function FileUpload({ 
  value, 
  onChange, 
  disabled = false, 
  accept = ".pdf,.doc,.docx,.xls,.xlsx",
  maxSize = 10 * 1024 * 1024, // 10MB default
  placeholder = "เลือกไฟล์เพื่ออัปโหลด"
}) {
  const [loading, setLoading] = useState(false);
  const [fileInfo, setFileInfo] = useState(value ? {
    name: value.split('/').pop(),
    path: value,
    type: getFileTypeFromPath(value)
  } : null);

  function getFileTypeFromPath(path) {
    if (!path) return 'unknown';
    const extension = path.split('.').pop().toLowerCase();
    return extension;
  }

  const getFileIcon = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case 'pdf':
        return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
      case 'doc':
      case 'docx':
        return <FileWordOutlined style={{ color: '#1890ff' }} />;
      case 'xls':
      case 'xlsx':
        return <FileExcelOutlined style={{ color: '#52c41a' }} />;
      default:
        return <FileOutlined style={{ color: '#666' }} />;
    }
  };

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      message.error(`ไฟล์มีขนาดใหญ่เกินไป ขนาดสูงสุด ${maxSizeMB}MB`);
      return false;
    }

    // Check file type if accept is specified
    if (accept) {
      const allowedExtensions = accept.split(',').map(ext => ext.trim().toLowerCase());
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!allowedExtensions.includes(fileExtension)) {
        message.error(`ประเภทไฟล์ไม่ถูกต้อง อนุญาตเฉพาะ: ${accept}`);
        return false;
      }
    }

    return true;
  };

  const handleUpload = async (file) => {
    if (!validateFile(file)) {
      return false;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://banpho.sosmartsolution.com/api/upload-file', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Extract path from full URL
        // https://banpho.sosmartsolution.com/storage/pdf/1752043878_a_250718_162515.pdf
        // becomes: pdf/1752043878_a_250718_162515.pdf
        const fullUrl = result.file_url || result.url;
        const path = fullUrl.replace('https://banpho.sosmartsolution.com/storage/', '');
        
        const newFileInfo = {
          name: file.name,
          path: path,
          type: getFileTypeFromPath(file.name),
          size: file.size,
          fullUrl: fullUrl
        };

        setFileInfo(newFileInfo);
        onChange?.(path); // Return only the path for database storage
        message.success('อัปโหลดไฟล์สำเร็จ');
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error(error.message || 'เกิดข้อผิดพลาดในการอัปโหลด');
    } finally {
      setLoading(false);
    }

    return false; // Prevent default upload behavior
  };

  const handleRemove = () => {
    setFileInfo(null);
    onChange?.(null);
    message.success('ลบไฟล์แล้ว');
  };

  const handleDownload = () => {
    if (fileInfo?.fullUrl) {
      window.open(fileInfo.fullUrl, '_blank');
    } else if (fileInfo?.path) {
      window.open(`https://banpho.sosmartsolution.com/storage/${fileInfo.path}`, '_blank');
    }
  };

  return (
    <div>
      {!fileInfo ? (
        <Upload
          beforeUpload={() => false} // Prevent auto upload
          customRequest={({ file }) => handleUpload(file)}
          showUploadList={false}
          disabled={disabled || loading}
          accept={accept}
        >
          <Button
            icon={<UploadOutlined />}
            loading={loading}
            disabled={disabled}
            block
          >
            {loading ? 'กำลังอัปโหลด...' : placeholder}
          </Button>
        </Upload>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Space>
              {getFileIcon(fileInfo.type)}
              <Text strong>{fileInfo.name}</Text>
              <Tag color="blue">{fileInfo.type?.toUpperCase()}</Tag>
            </Space>
            
            <Text type="secondary" className="text-xs">
              Path: {fileInfo.path}
            </Text>
            
            {fileInfo.size && (
              <Text type="secondary" className="text-xs">
                ขนาด: {Math.round(fileInfo.size / 1024)} KB
              </Text>
            )}
            
            <Space>
              <Button
                type="link"
                size="small"
                icon={<LinkOutlined />}
                onClick={handleDownload}
              >
                ดูไฟล์
              </Button>
              
              {!disabled && (
                <>
                  <Upload
                    beforeUpload={() => false}
                    customRequest={({ file }) => handleUpload(file)}
                    showUploadList={false}
                    accept={accept}
                  >
                    <Button type="link" size="small" loading={loading}>
                      เปลี่ยนไฟล์
                    </Button>
                  </Upload>
                  
                  <Button
                    type="link"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleRemove}
                  >
                    ลบ
                  </Button>
                </>
              )}
            </Space>
          </Space>
        </div>
      )}
      
      <div className="mt-2 text-xs text-gray-500">
        รองรับไฟล์: {accept} (ขนาดไม่เกิน {Math.round(maxSize / (1024 * 1024))}MB)
      </div>
    </div>
  );
}