"use client";

import { useState, useEffect } from "react";
import { Upload, message, Avatar, Button, Space } from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { uploadImage, validateImageFile, getImageUrl } from "@/lib/imageUtils";

export default function ImageUpload({ value, onChange, disabled = false }) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(value);

  // Update local state when value prop changes
  useEffect(() => {
    setImageUrl(value);
  }, [value]);

  const beforeUpload = (file) => {
    try {
      validateImageFile(file);
      return true;
    } catch (error) {
      message.error(error.message);
      return false;
    }
  };

  const handleUpload = async (file) => {
    setLoading(true);

    try {
      const result = await uploadImage(file);
      const newImageUrl = result.url;
      setImageUrl(newImageUrl);
      onChange?.(newImageUrl);
      message.success("อัปโหลดรูปภาพสำเร็จ");
    } catch (error) {
      console.error("Upload error:", error);
      message.error(error.message || "เกิดข้อผิดพลาดในการอัปโหลด");
    } finally {
      setLoading(false);
    }

    return false; // Prevent default upload behavior
  };

  const handleRemove = () => {
    setImageUrl(null);
    onChange?.(null);
    message.success("ลบรูปภาพแล้ว");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: 16 }}>
        <Avatar
          size={100}
          src={getImageUrl(imageUrl)}
          icon={<UserOutlined />}
          style={{
            backgroundColor: imageUrl ? "transparent" : "#1890ff",
            border: "2px dashed #d9d9d9",
          }}
        />
      </div>

      <Space direction="vertical" size="small">
        <Upload
          beforeUpload={beforeUpload}
          customRequest={({ file }) => handleUpload(file)}
          showUploadList={false}
          disabled={disabled || loading}
        >
          <Button
            icon={<UploadOutlined />}
            loading={loading}
            disabled={disabled}
          >
            {loading ? "กำลังอัปโหลด..." : "เลือกรูปภาพ"}
          </Button>
        </Upload>

        {imageUrl && (
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={handleRemove}
            disabled={disabled}
          >
            ลบรูปภาพ
          </Button>
        )}
      </Space>

      <div style={{ marginTop: 8, fontSize: "12px", color: "#666" }}>
        รองรับไฟล์: JPG, PNG, GIF, WebP (ไม่เกิน 5MB)
      </div>
    </div>
  );
}
