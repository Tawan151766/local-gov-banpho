"use client";

import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  Tag,
  Upload,
  Progress,
  Typography,
  App,
  Row,
  Col,
  Select,
  DatePicker,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  FileTextOutlined,
  SnippetsOutlined,
  EyeInvisibleOutlined,
  UnorderedListOutlined,
  SearchOutlined,
  ReloadOutlined,
  ClearOutlined,
} from "@ant-design/icons";

const { TextArea, Search } = Input;
const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Post type configurations
const POST_TYPES = {
  "manual-management": {
    title: "คู่มือ",
    type: "คู่มือ",
    icon: <FileTextOutlined />,
    color: "blue",
  },
  "general-news": {
    title: "ข่าวสารทั่วไป",
    type: "ข่าวสารทั่วไป",
    icon: <FileTextOutlined />,
    color: "green",
  },
  "community-activities": {
    title: "กิจกรรมชุมชน",
    type: "กิจกรรมชุมชน",
    icon: <FileTextOutlined />,
    color: "orange",
  },
  "development-projects": {
    title: "โครงการพัฒนา",
    type: "โครงการพัฒนา",
    icon: <FileTextOutlined />,
    color: "purple",
  },
  "important-announcements": {
    title: "ประกาศสำคัญ",
    type: "ประกาศสำคัญ",
    icon: <FileTextOutlined />,
    color: "red",
  },
  "procurement-announcements": {
    title: "ประกาศจัดซื้อจัดจ้าง",
    type: "ประกาศจัดซื้อจัดจ้าง",
    icon: <FileTextOutlined />,
    color: "cyan",
  },
  "procurement-announcements-results": {
    title: "ผลประกาศจัดซื้อจัดจ้าง",
    type: "ผลประกาศจัดซื้อจัดจ้าง",
    icon: <FileTextOutlined />,
    color: "volcano",
  },
  "public-document": {
    title: "เอกสารเผยแพร่",
    type: "เอกสารเผยแพร่",
    icon: <FileTextOutlined />,
    color: "volcano",
  },
  "procurement-announcements-reports": {
    title: "รายงานผลการจัดซื้อจัดจ้าง",
    type: "รายงานผลการจัดซื้อจัดจ้าง",
    icon: <FileTextOutlined />,
    color: "purple",
  },
  "public-relations": {
    title: "ข่าวประชาสัมพันธ์",
    type: "ข่าวประชาสัมพันธ์",
    icon: <FileTextOutlined />,
    color: "magenta",
  },
  "child-development-center": {
    title: "ศูนย์พัฒนาเด็กเล็ก",
    type: "ศูนย์พัฒนาเด็กเล็ก",
    icon: <FileTextOutlined />,
    color: "green",
  },
  "internal-performance-evaluation": {
    title: "การประเมิน ประสิทธิภาพภายใน",
    type: "การประเมิน ประสิทธิภาพภายใน",
    icon: <FileTextOutlined />,
    color: "purple",
  },

  announcement: {
    title: "ป้ายประกาศ",
    type: "ป้ายประกาศ",
    icon: <SnippetsOutlined />,
    color: "geekblue",
  },
  activities: {
    title: "กิจกรรม",
    type: "กิจกรรม",
    icon: <FileTextOutlined />,
    color: "gold",
  },
};

export default function PostTypeManagement({ postType }) {
  const { notification } = App.useApp();

  // Data states
  const [posts, setPosts] = useState([]);

  // Add pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} จาก ${total} รายการ`,
  });

  // Loading states
  const [loading, setLoading] = useState(false);

  // Search states
  const [searchFilters, setSearchFilters] = useState({
    search: "",
    fileSearch: "",
    dateRange: null,
    sortBy: "created_at",
    sortOrder: "desc",
    searchType: "content", // 'content' or 'files'
  });

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [fileUploadModalVisible, setFileUploadModalVisible] = useState(false);
  const [imageUploadModalVisible, setImageUploadModalVisible] = useState(false);
  const [videoUploadModalVisible, setVideoUploadModalVisible] = useState(false);
  const [fileListModalVisible, setFileListModalVisible] = useState(false);

  // Form and editing states
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // File upload states
  const [uploadedFilePath, setUploadedFilePath] = useState(null);
  const [uploadedFileData, setUploadedFileData] = useState(null);
  const [currentUploadRecord, setCurrentUploadRecord] = useState(null);

  // Image upload states
  const [uploadedImagePath, setUploadedImagePath] = useState(null);
  const [uploadedImageData, setUploadedImageData] = useState(null);
  const [currentImageUploadRecord, setCurrentImageUploadRecord] =
    useState(null);

  // Video upload states
  const [uploadedVideoPath, setUploadedVideoPath] = useState(null);
  const [uploadedVideoData, setUploadedVideoData] = useState(null);
  const [currentVideoUploadRecord, setCurrentVideoUploadRecord] =
    useState(null);

  // UI states
  const [showUploadButtons, setShowUploadButtons] = useState(false);

  // File list states
  const [currentFileListRecord, setCurrentFileListRecord] = useState(null);
  const [fileListData, setFileListData] = useState({
    pdfs: [],
    photos: [],
    videos: [],
  });
  const [loadingFiles, setLoadingFiles] = useState(false);

  const config = POST_TYPES[postType] || POST_TYPES["general-news"];

  const loadPosts = useCallback(
    async (page = 1, pageSize = 10, filters = searchFilters) => {
      try {
        setLoading(true);
        console.log(
          "Loading posts for type:",
          config.type,
          "Page:",
          page,
          "PageSize:",
          pageSize,
          "Filters:",
          filters
        );

        // Build query parameters
        const params = new URLSearchParams({
          type: config.type,
          page: page.toString(),
          limit: pageSize.toString(),
        });

        // Add search filters
        if (filters.search && filters.search.trim()) {
          params.append("search", filters.search.trim());
        }

        // Add file search
        if (filters.fileSearch && filters.fileSearch.trim()) {
          params.append("fileSearch", filters.fileSearch.trim());
        }

        // Add search type
        if (filters.searchType) {
          params.append("searchType", filters.searchType);
        }

        if (filters.dateRange && filters.dateRange.length === 2) {
          params.append(
            "startDate",
            dayjs(filters.dateRange[0]).format("YYYY-MM-DD")
          );
          params.append(
            "endDate",
            dayjs(filters.dateRange[1]).format("YYYY-MM-DD")
          );
        }

        if (filters.sortBy) {
          params.append("sortBy", filters.sortBy);
        }

        if (filters.sortOrder) {
          params.append("sortOrder", filters.sortOrder);
        }

        const response = await fetch(`/api/posts?${params.toString()}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API response:", data);

        if (data.success) {
          setPosts(data.data || []);

          // Update pagination state with data from API
          setPagination((prev) => ({
            ...prev,
            current: data.pagination?.page || page,
            pageSize: data.pagination?.limit || pageSize,
            total: data.pagination?.total || 0,
          }));

          console.log(
            "Posts loaded:",
            data.data?.length || 0,
            "Total:",
            data.pagination?.total || 0
          );
        } else {
          console.error("API error:", data.error);
          notification.error({
            message: "เกิดข้อผิดพลาด",
            description: data.error || "เกิดข้อผิดพลาดในการโหลดข้อมูล",
          });
        }
      } catch (error) {
        console.error("Load posts error:", error);
        notification.error({
          message: "เกิดข้อผิดพลาด",
          description: "เกิดข้อผิดพลาดในการโหลดข้อมูลร",
        });
      } finally {
        setLoading(false);
      }
    },
    [config.type, notification, searchFilters]
  );

  useEffect(() => {
    loadPosts(1, 10, searchFilters);

    // Cleanup function to prevent memory leaks
    return () => {
      // Reset form when component unmounts
      if (form) {
        form.resetFields();
      }
    };
  }, [loadPosts, form, searchFilters]);

  // Handle table pagination change
  const handleTableChange = (paginationConfig, filters, sorter) => {
    const { current, pageSize } = paginationConfig;

    // Handle sorting
    let newFilters = { ...searchFilters };
    if (sorter && sorter.field) {
      newFilters.sortBy = sorter.field;
      newFilters.sortOrder = sorter.order === "ascend" ? "asc" : "desc";
      setSearchFilters(newFilters);
    }

    loadPosts(current, pageSize, newFilters);
  };

  // Handle content search
  const handleSearch = (value) => {
    const newFilters = {
      ...searchFilters,
      search: value,
      searchType: "content",
    };
    setSearchFilters(newFilters);
    loadPosts(1, pagination.pageSize, newFilters);
  };

  // Handle file search
  const handleFileSearch = (value) => {
    const newFilters = {
      ...searchFilters,
      fileSearch: value,
      searchType: "files",
    };
    setSearchFilters(newFilters);
    loadPosts(1, pagination.pageSize, newFilters);
  };

  // Handle search type change
  const handleSearchTypeChange = (type) => {
    const newFilters = { ...searchFilters, searchType: type };
    setSearchFilters(newFilters);
    loadPosts(1, pagination.pageSize, newFilters);
  };

  // Handle date range change
  const handleDateRangeChange = (dates) => {
    const newFilters = { ...searchFilters, dateRange: dates };
    setSearchFilters(newFilters);
    loadPosts(1, pagination.pageSize, newFilters);
  };

  // Handle sort change
  const handleSortChange = (value) => {
    const [sortBy, sortOrder] = value.split("-");
    const newFilters = { ...searchFilters, sortBy, sortOrder };
    setSearchFilters(newFilters);
    loadPosts(1, pagination.pageSize, newFilters);
  };

  // Clear all filters
  const handleClearFilters = () => {
    const newFilters = {
      search: "",
      fileSearch: "",
      dateRange: null,
      sortBy: "created_at",
      sortOrder: "desc",
      searchType: "content",
    };
    setSearchFilters(newFilters);
    loadPosts(1, pagination.pageSize, newFilters);
  };

  // Refresh data
  const handleRefresh = () => {
    loadPosts(pagination.current, pagination.pageSize, searchFilters);
  };

  const handleCreate = () => {
    setEditingRecord(null);
    setModalVisible(true);

    // Safely reset form
    try {
      if (form) {
        form.resetFields();
      }
    } catch (error) {
      console.warn("Error resetting form:", error);
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setModalVisible(true);

    // Safely set form values
    try {
      if (form) {
        form.setFieldsValue(record);
      }
    } catch (error) {
      console.warn("Error setting form values:", error);
    }
  };

  const handleFileUpload = (record) => {
    setCurrentUploadRecord(record);
    setUploadedFilePath(record.file_path || null);
    setUploadedFileData(
      record.file_path
        ? {
            file_path: record.file_path,
            original_name: record.file_path.split("/").pop(),
          }
        : null
    );
    setFileUploadModalVisible(true);
  };

  const handleImageUpload = (record) => {
    setCurrentImageUploadRecord(record);
    setUploadedImagePath(null);
    setUploadedImageData(null);
    setImageUploadModalVisible(true);
  };

  const handleVideoUpload = (record) => {
    setCurrentVideoUploadRecord(record);
    setUploadedVideoPath(null);
    setUploadedVideoData(null);
    setVideoUploadModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        notification.success({
          message: "สำเร็จ",
          description: "ลบโพสต์สำเร็จ",
        });

        // Reload current page data
        loadPosts(pagination.current, pagination.pageSize, searchFilters);
      } else {
        notification.error({
          message: "เกิดข้อผิดพลาด",
          description: data.error || "เกิดข้อผิดพลาด",
        });
      }
    } catch (error) {
      notification.error({
        message: "เกิดข้อผิดพลาด",
        description: "เกิดข้อผิดพลาดในการลบข้อมูล",
      });
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      if (!values.title_name?.trim()) {
        notification.error({
          message: "ข้อมูลไม่ครบถ้วน",
          description: "กรุณากรอกชื่อโพสต์",
        });
        return;
      }

      // Add post type to values
      const submitData = {
        title_name: values.title_name,
        topic_name: values.topic_name,
        details: values.details,
        date: values.date,
        post_type: config.type,
      };

      const url = editingRecord
        ? `/api/posts/${editingRecord.id}`
        : "/api/posts";
      const method = editingRecord ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        notification.success({
          message: "สำเร็จ",
          description: editingRecord ? "แก้ไขโพสต์สำเร็จ" : "เพิ่มโพสต์สำเร็จ",
        });
        setModalVisible(false);

        // Safely reset form
        try {
          if (form) {
            form.resetFields();
          }
        } catch (error) {
          console.warn("Error resetting form after submit:", error);
        }

        // Reload current page data
        loadPosts(pagination.current, pagination.pageSize);
      } else {
        notification.error({
          message: "เกิดข้อผิดพลาด",
          description: data.error || "เกิดข้อผิดพลาด",
        });
      }
    } catch (error) {
      notification.error({
        message: "เกิดข้อผิดพลาด",
        description: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUploadSubmit = async () => {
    if (!currentUploadRecord || !uploadedFileData) {
      notification.error({
        message: "เกิดข้อผิดพลาด",
        description: "กรุณาเลือกไฟล์ก่อนบันทึก",
      });
      return;
    }

    try {
      setLoading(true);

      // Create new post_pdf record instead of updating post_details
      // Remove /storage prefix from file path
      const cleanFilePath = uploadedFileData.file_path.replace("/storage", "");

      const postPdfData = {
        post_detail_id: currentUploadRecord.id,
        post_pdf_file: cleanFilePath, // "/uploads/1754499265_tawan.pdf"
      };

      console.log("Sending post PDF data:", postPdfData);

      const response = await fetch("/api/post-pdfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postPdfData),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        // Check if response is HTML (404 page) or JSON error
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("text/html")) {
          throw new Error(
            `API endpoint not found: /api/post-pdfs (${response.status})`
          );
        } else {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }
      }

      const data = await response.json();

      if (data.success) {
        notification.success({
          message: "สำเร็จ",
          description: "อัพโหลดไฟล์สำเร็จ",
        });
        setFileUploadModalVisible(false);
        setUploadedFilePath(null);
        setUploadedFileData(null);
        setCurrentUploadRecord(null);
        loadPosts(pagination.current, pagination.pageSize, searchFilters);
      } else {
        notification.error({
          message: "เกิดข้อผิดพลาด",
          description: data.error || "เกิดข้อผิดพลาดในการบันทึกไฟล์",
        });
      }
    } catch (error) {
      console.error("File upload error:", error);

      // Special handling for JSON parse errors
      if (error.message.includes("Unexpected token")) {
        notification.error({
          message: "เกิดข้อผิดพลาด",
          description:
            "API endpoint /api/post-pdfs ยังไม่ได้สร้าง กรุณาสร้าง API endpoint นี้ก่อน",
        });
      } else {
        notification.error({
          message: "เกิดข้อผิดพลาด",
          description: error.message || "เกิดข้อผิดพลาดในการบันทึกไฟล์",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUploadSubmit = async () => {
    if (!currentImageUploadRecord || !uploadedImageData) {
      notification.error({
        message: "เกิดข้อผิดพลาด",
        description: "กรุณาเลือกไฟล์รูปภาพก่อนบันทึก",
      });
      return;
    }

    try {
      setLoading(true);

      // Create new post_photo record
      const cleanFilePath = uploadedImageData.file_path.replace("/storage", "");

      const postPhotoData = {
        post_detail_id: currentImageUploadRecord.id,
        post_photo_file: cleanFilePath,
        post_photo_status: "1", // Active status as string
      };

      console.log("Sending post photo data:", postPhotoData);

      const response = await fetch("/api/post-photos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postPhotoData),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("text/html")) {
          throw new Error(
            `API endpoint not found: /api/post-photos (${response.status})`
          );
        } else {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }
      }

      const data = await response.json();

      if (data.success) {
        notification.success({
          message: "สำเร็จ",
          description: "อัพโหลดรูปภาพสำเร็จ",
        });
        setImageUploadModalVisible(false);
        setUploadedImagePath(null);
        setUploadedImageData(null);
        setCurrentImageUploadRecord(null);
        loadPosts(pagination.current, pagination.pageSize, searchFilters);
      } else {
        notification.error({
          message: "เกิดข้อผิดพลาด",
          description: data.error || "เกิดข้อผิดพลาดในการบันทึกรูปภาพ",
        });
      }
    } catch (error) {
      console.error("Image upload error:", error);

      notification.error({
        message: "เกิดข้อผิดพลาด",
        description: error.message || "เกิดข้อผิดพลาดในการบันทึกรูปภาพ",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUploadSubmit = async () => {
    if (!currentVideoUploadRecord || !uploadedVideoData) {
      notification.error({
        message: "เกิดข้อผิดพลาด",
        description: "กรุณาเลือกไฟล์วิดีโอก่อนบันทึก",
      });
      return;
    }

    try {
      setLoading(true);

      // Create new post_video record
      const cleanFilePath = uploadedVideoData.file_path.replace("/storage", "");

      const postVideoData = {
        post_detail_id: currentVideoUploadRecord.id,
        post_video_file: cleanFilePath,
      };

      console.log("Sending post video data:", postVideoData);

      const response = await fetch("/api/post-videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postVideoData),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("text/html")) {
          throw new Error(
            `API endpoint not found: /api/post-videos (${response.status})`
          );
        } else {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }
      }

      const data = await response.json();

      if (data.success) {
        notification.success({
          message: "สำเร็จ",
          description: "อัพโหลดวิดีโอสำเร็จ",
        });
        setVideoUploadModalVisible(false);
        setUploadedVideoPath(null);
        setUploadedVideoData(null);
        setCurrentVideoUploadRecord(null);
        loadPosts(pagination.current, pagination.pageSize, searchFilters);
      } else {
        notification.error({
          message: "เกิดข้อผิดพลาด",
          description: data.error || "เกิดข้อผิดพลาดในการบันทึกวิดีโอ",
        });
      }
    } catch (error) {
      console.error("Video upload error:", error);

      notification.error({
        message: "เกิดข้อผิดพลาด",
        description: error.message || "เกิดข้อผิดพลาดในการบันทึกวิดีโอ",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewFileList = async (record) => {
    setCurrentFileListRecord(record);
    setFileListModalVisible(true);
    await loadFilesList(record.id);
  };

  const loadFilesList = async (postDetailId) => {
    try {
      setLoadingFiles(true);

      // Load PDFs
      const pdfsResponse = await fetch(
        `/api/post-pdfs?post_detail_id=${postDetailId}`
      );
      const pdfsData = await pdfsResponse.json();

      // Load Photos
      const photosResponse = await fetch(
        `/api/post-photos?post_detail_id=${postDetailId}`
      );
      const photosData = await photosResponse.json();

      // Load Videos
      const videosResponse = await fetch(
        `/api/post-videos?post_detail_id=${postDetailId}`
      );
      const videosData = await videosResponse.json();

      setFileListData({
        pdfs: pdfsData.success ? pdfsData.data : [],
        photos: photosData.success ? photosData.data : [],
        videos: videosData.success ? videosData.data : [],
      });
    } catch (error) {
      console.error("Error loading files list:", error);
      notification.error({
        message: "เกิดข้อผิดพลาด",
        description: "เกิดข้อผิดพลาดในการโหลดรายการไฟล์",
      });
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleDeleteFile = async (fileId, fileType) => {
    try {
      let apiEndpoint = "";
      switch (fileType) {
        case "pdf":
          apiEndpoint = `/api/post-pdfs?id=${fileId}`;
          break;
        case "photo":
          apiEndpoint = `/api/post-photos?id=${fileId}`;
          break;
        case "video":
          apiEndpoint = `/api/post-videos?id=${fileId}`;
          break;
        default:
          return;
      }

      const response = await fetch(apiEndpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        notification.success({
          message: "สำเร็จ",
          description: "ลบไฟล์สำเร็จ",
        });

        // Reload files list
        await loadFilesList(currentFileListRecord.id);

        // Reload posts to update file counts
        loadPosts(pagination.current, pagination.pageSize, searchFilters);
      } else {
        notification.error({
          message: "เกิดข้อผิดพลาด",
          description: data.error || "เกิดข้อผิดพลาดในการลบไฟล์",
        });
      }
    } catch (error) {
      console.error("Delete file error:", error);
      notification.error({
        message: "เกิดข้อผิดพลาด",
        description: "เกิดข้อผิดพลาดในการลบไฟล์",
      });
    }
  };

  // File upload component
  const FileUpload = ({
    value,
    onChange,
    placeholder,
    accept,
    maxSize = 10,
  }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleUpload = async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        setUploading(true);
        setUploadProgress(0);

        const response = await fetch("/api/manual/upload-laravel", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          setUploadProgress(100);
          onChange(result.data.file_path, result.data);
          notification.success({
            message: "สำเร็จ",
            description: "อัพโหลดไฟล์สำเร็จ",
          });
        } else {
          notification.error({
            message: "เกิดข้อผิดพลาด",
            description: result.error || "เกิดข้อผิดพลาดในการอัพโหลด",
          });
        }
      } catch (error) {
        notification.error({
          message: "เกิดข้อผิดพลาด",
          description: "เกิดข้อผิดพลาดในการอัพโหลด",
        });
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }

      return false; // Prevent default upload
    };

    const handleRemove = () => {
      onChange(null, null);
    };

    return (
      <div>
        <Space direction="vertical" style={{ width: "100%" }}>
          {!value && (
            <Upload
              beforeUpload={handleUpload}
              showUploadList={false}
              accept={accept}
              disabled={uploading}
            >
              <Button
                icon={<UploadOutlined />}
                loading={uploading}
                disabled={uploading}
              >
                {placeholder || "เลือกไฟล์"}
              </Button>
            </Upload>
          )}

          {value && (
            <div
              style={{
                padding: "8px 12px",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                backgroundColor: "#fafafa",
              }}
            >
              <Space>
                <FileTextOutlined style={{ color: "#1890ff" }} />
                <Text>{value.split("/").pop()}</Text>
                <Button size="small" type="link" danger onClick={handleRemove}>
                  ลบ
                </Button>
              </Space>
            </div>
          )}

          {uploading && uploadProgress > 0 && (
            <Progress
              percent={uploadProgress}
              size="small"
              status={uploadProgress === 100 ? "success" : "active"}
            />
          )}

          <div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {accept?.includes(".mp4")
                ? `รองรับไฟล์: MP4, AVI, MOV, WMV, FLV, WebM, MKV | ขนาดไฟล์สูงสุด: ${maxSize}MB`
                : accept?.includes(".png")
                ? `รองรับไฟล์: PNG, JPG, JPEG, GIF, WebP, SVG | ขนาดไฟล์สูงสุด: ${maxSize}MB`
                : `รองรับไฟล์: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX | ขนาดไฟล์สูงสุด: ${maxSize}MB`}
            </Text>
          </div>
        </Space>
      </div>
    );
  };

  const columns = [
    {
      title: "ลำดับ",
      key: "index",
      width: 80,
      render: (_, record, index) => {
        // Calculate correct index based on pagination
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: "ชื่อโพสต์",
      dataIndex: "title_name",
      key: "title_name",
      ellipsis: true,
    },
    {
      title: "หัวข้อ",
      dataIndex: "topic_name",
      key: "topic_name",
      ellipsis: true,
    },
    {
      title: "วันที่",
      dataIndex: "date",
      key: "date",
      width: 120,
      render: (date) => {
        return new Date(date).toLocaleDateString("th-TH", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      },
    },
    {
      title: "ไฟล์แนบ",
      key: "files",
      width: 200,
      render: (_, record) => {
        const totalFiles =
          (record.pdfs_count || 0) +
          (record.photos_count || 0) +
          (record.videos_count || 0);

        return (
          <Space direction="vertical" size="small">
            {totalFiles > 0 ? (
              <>
                <Button
                  size="small"
                  type="link"
                  icon={<UnorderedListOutlined />}
                  onClick={() => handleViewFileList(record)}
                >
                  ดูรายการไฟล์
                </Button>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  <Space size={4}>
                    {record.pdfs_count > 0 && (
                      <Tag size="small" color="blue">
                        PDF: {record.pdfs_count}
                      </Tag>
                    )}
                    {record.photos_count > 0 && (
                      <Tag size="small" color="green">
                        รูป: {record.photos_count}
                      </Tag>
                    )}
                    {record.videos_count > 0 && (
                      <Tag size="small" color="purple">
                        วิดีโอ: {record.videos_count}
                      </Tag>
                    )}
                  </Space>
                </div>
                {/* Show matched file names if searching files */}
                {searchFilters.searchType === "files" &&
                  searchFilters.fileSearch &&
                  record.matched_files && (
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#1890ff",
                        marginTop: 4,
                      }}
                    >
                      <Text type="secondary">ไฟล์ที่ตรงกัน:</Text>
                      <br />
                      {record.matched_files.slice(0, 2).map((file, index) => (
                        <div key={index} style={{ color: "#1890ff" }}>
                          • {file.split("/").pop()}
                        </div>
                      ))}
                      {record.matched_files.length > 2 && (
                        <div style={{ color: "#666" }}>
                          และอีก {record.matched_files.length - 2} ไฟล์
                        </div>
                      )}
                    </div>
                  )}
              </>
            ) : (
              <Text type="secondary">ไม่มีไฟล์แนบ</Text>
            )}
          </Space>
        );
      },
    },
    {
      title: "อัพโหลดไฟล์",
      key: "upload",
      width: showUploadButtons ? 350 : 120,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Button
            size="small"
            type="text"
            icon={
              showUploadButtons ? <EyeInvisibleOutlined /> : <EyeOutlined />
            }
            onClick={() => setShowUploadButtons(!showUploadButtons)}
            style={{
              padding: "2px 8px",
              height: "auto",
              fontSize: "12px",
              color: "#666",
            }}
          >
            {showUploadButtons ? "ซ่อน" : "กดเพื่อ Upload"}
          </Button>

          {showUploadButtons && (
            <Space>
              <Button
                size="small"
                icon={<UploadOutlined />}
                onClick={() => handleFileUpload(record)}
                type="dashed"
              >
                PDF
              </Button>
              <Button
                size="small"
                icon={<UploadOutlined />}
                onClick={() => handleImageUpload(record)}
                type="dashed"
                style={{ color: "#52c41a", borderColor: "#52c41a" }}
              >
                รูปภาพ
              </Button>
              <Button
                size="small"
                icon={<UploadOutlined />}
                onClick={() => handleVideoUpload(record)}
                type="dashed"
                style={{ color: "#722ed1", borderColor: "#722ed1" }}
              >
                วิดีโอ
              </Button>
            </Space>
          )}
        </Space>
      ),
    },
    {
      title: "การจัดการ",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            แก้ไข
          </Button>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ที่จะลบโพสต์นี้?"
            onConfirm={() => handleDelete(record.id)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              ลบ
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {config.icon} {config.title}
            </Title>
            <Text type="secondary" style={{ fontSize: "14px" }}>
              ทั้งหมด {pagination.total} รายการ
            </Text>
          </div>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
            >
              รีเฟรช
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
              style={{ minWidth: 120 }}
            >
              เพิ่ม{config.title}
            </Button>
          </Space>
        </div>

        {/* Search and Filter Section */}
        <Card
          size="small"
          style={{ marginBottom: 16, backgroundColor: "#fafafa" }}
          title={
            <Space>
              <SearchOutlined />
              <span>ค้นหาและกรอง</span>
            </Space>
          }
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="ประเภทการค้นหา"
                style={{ width: "100%" }}
                value={searchFilters.searchType}
                onChange={handleSearchTypeChange}
              >
                <Option value="content">ค้นหาเนื้อหา</Option>
                <Option value="files">ค้นหาจากไฟล์</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
              {searchFilters.searchType === "content" ? (
                <Search
                  placeholder="ค้นหาชื่อโพสต์หรือหัวข้อ..."
                  allowClear
                  enterButton={<SearchOutlined />}
                  size="middle"
                  value={searchFilters.search}
                  onChange={(e) =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      search: e.target.value,
                    }))
                  }
                  onSearch={handleSearch}
                />
              ) : (
                <Search
                  placeholder="ค้นหาชื่อไฟล์ PDF..."
                  allowClear
                  enterButton={<SearchOutlined />}
                  size="middle"
                  value={searchFilters.fileSearch}
                  onChange={(e) =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      fileSearch: e.target.value,
                    }))
                  }
                  onSearch={handleFileSearch}
                />
              )}
            </Col>
            <Col xs={24} sm={12} md={6}>
              <RangePicker
                placeholder={["วันที่เริ่มต้น", "วันที่สิ้นสุด"]}
                style={{ width: "100%" }}
                value={searchFilters.dateRange}
                onChange={handleDateRangeChange}
                format="DD/MM/YYYY"
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Button
                icon={<ClearOutlined />}
                onClick={handleClearFilters}
                style={{ width: "100%" }}
                disabled={
                  !searchFilters.search &&
                  !searchFilters.fileSearch &&
                  !searchFilters.dateRange
                }
              >
                ล้างตัวกรอง
              </Button>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="เรียงลำดับ"
                style={{ width: "100%" }}
                value={`${searchFilters.sortBy}-${searchFilters.sortOrder}`}
                onChange={handleSortChange}
              >
                <Option value="created_at-desc">
                  วันที่สร้าง (ใหม่ → เก่า)
                </Option>
                <Option value="created_at-asc">
                  วันที่สร้าง (เก่า → ใหม่)
                </Option>
                <Option value="date-desc">วันที่โพสต์ (ใหม่ → เก่า)</Option>
                <Option value="date-asc">วันที่โพสต์ (เก่า → ใหม่)</Option>
                <Option value="title_name-asc">ชื่อโพสต์ (A → Z)</Option>
                <Option value="title_name-desc">ชื่อโพสต์ (Z → A)</Option>
              </Select>
            </Col>
          </Row>

          {/* Active Filters Display */}
          {(searchFilters.search ||
            searchFilters.fileSearch ||
            searchFilters.dateRange) && (
            <div
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTop: "1px solid #e8e8e8",
              }}
            >
              <Text
                type="secondary"
                style={{ fontSize: "12px", marginRight: 8 }}
              >
                ตัวกรองที่ใช้:
              </Text>
              <Space size={[4, 4]} wrap>
                {searchFilters.search && (
                  <Tag closable onClose={() => handleSearch("")} color="blue">
                    ค้นหาเนื้อหา: {searchFilters.search}
                  </Tag>
                )}
                {searchFilters.fileSearch && (
                  <Tag
                    closable
                    onClose={() => handleFileSearch("")}
                    color="orange"
                  >
                    ค้นหาไฟล์: {searchFilters.fileSearch}
                  </Tag>
                )}
                {searchFilters.dateRange && (
                  <Tag
                    closable
                    onClose={() => handleDateRangeChange(null)}
                    color="green"
                  >
                    วันที่:{" "}
                    {dayjs(searchFilters.dateRange[0]).format("DD/MM/YYYY")} -{" "}
                    {dayjs(searchFilters.dateRange[1]).format("DD/MM/YYYY")}
                  </Tag>
                )}
              </Space>
            </div>
          )}
        </Card>

        <Table
          columns={columns}
          dataSource={posts}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          locale={{
            emptyText:
              searchFilters.search ||
              searchFilters.fileSearch ||
              searchFilters.dateRange
                ? `ไม่พบข้อมูลที่ตรงกับการค้นหา ${
                    searchFilters.searchType === "files"
                      ? `"${
                          searchFilters.fileSearch || "ตามช่วงวันที่ที่เลือก"
                        }" ในไฟล์ PDF`
                      : `"${searchFilters.search || "ตามช่วงวันที่ที่เลือก"}"`
                  }`
                : `ยังไม่มี${config.title}`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingRecord ? `แก้ไข${config.title}` : `เพิ่ม${config.title}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="ชื่อโพสต์"
            name="title_name"
            rules={[{ required: true, message: "กรุณากรอกชื่อโพสต์" }]}
          >
            <Input placeholder="กรอกชื่อโพสต์" />
          </Form.Item>

          <Form.Item label="หัวข้อ" name="topic_name">
            <Input placeholder="กรอกหัวข้อ" />
          </Form.Item>

          <Form.Item label="วันที่" name="date">
            <Input type="date" />
          </Form.Item>

          <Form.Item label="รายละเอียด" name="details">
            <TextArea rows={6} placeholder="กรอกรายละเอียด" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingRecord ? "บันทึกการแก้ไข" : `เพิ่ม${config.title}`}
              </Button>
              <Button onClick={() => setModalVisible(false)}>ยกเลิก</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* File Upload Modal */}
      <Modal
        title={`อัพโหลดไฟล์ - ${currentUploadRecord?.title_name || ""}`}
        open={fileUploadModalVisible}
        onCancel={() => {
          setFileUploadModalVisible(false);
          setUploadedFilePath(null);
          setUploadedFileData(null);
          setCurrentUploadRecord(null);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setFileUploadModalVisible(false);
              setUploadedFilePath(null);
              setUploadedFileData(null);
              setCurrentUploadRecord(null);
            }}
          >
            ยกเลิก
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleFileUploadSubmit}
            disabled={!uploadedFileData}
          >
            บันทึกไฟล์
          </Button>,
        ]}
        width={600}
      >
        <div style={{ padding: "20px 0" }}>
          <FileUpload
            value={uploadedFilePath}
            onChange={(filePath, fileData) => {
              setUploadedFilePath(filePath);
              setUploadedFileData(fileData);
            }}
            placeholder={`เลือกไฟล์${config.title}`}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.gif"
            maxSize={10}
          />
        </div>
      </Modal>

      {/* Image Upload Modal */}
      <Modal
        title={`อัพโหลดรูปภาพ - ${currentImageUploadRecord?.title_name || ""}`}
        open={imageUploadModalVisible}
        onCancel={() => {
          setImageUploadModalVisible(false);
          setUploadedImagePath(null);
          setUploadedImageData(null);
          setCurrentImageUploadRecord(null);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setImageUploadModalVisible(false);
              setUploadedImagePath(null);
              setUploadedImageData(null);
              setCurrentImageUploadRecord(null);
            }}
          >
            ยกเลิก
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleImageUploadSubmit}
            disabled={!uploadedImageData}
          >
            บันทึกรูปภาพ
          </Button>,
        ]}
        width={600}
      >
        <div style={{ padding: "20px 0" }}>
          <FileUpload
            value={uploadedImagePath}
            onChange={(filePath, fileData) => {
              setUploadedImagePath(filePath);
              setUploadedImageData(fileData);
            }}
            placeholder="เลือกไฟล์รูปภาพ"
            accept=".png,.jpg,.jpeg,.gif,.webp,.svg"
            maxSize={10}
          />
        </div>
      </Modal>

      {/* Video Upload Modal */}
      <Modal
        title={`อัพโหลดวิดีโอ - ${currentVideoUploadRecord?.title_name || ""}`}
        open={videoUploadModalVisible}
        onCancel={() => {
          setVideoUploadModalVisible(false);
          setUploadedVideoPath(null);
          setUploadedVideoData(null);
          setCurrentVideoUploadRecord(null);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setVideoUploadModalVisible(false);
              setUploadedVideoPath(null);
              setUploadedVideoData(null);
              setCurrentVideoUploadRecord(null);
            }}
          >
            ยกเลิก
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleVideoUploadSubmit}
            disabled={!uploadedVideoData}
          >
            บันทึกวิดีโอ
          </Button>,
        ]}
        width={600}
      >
        <div style={{ padding: "20px 0" }}>
          <FileUpload
            value={uploadedVideoPath}
            onChange={(filePath, fileData) => {
              setUploadedVideoPath(filePath);
              setUploadedVideoData(fileData);
            }}
            placeholder="เลือกไฟล์วิดีโอ"
            accept=".mp4,.avi,.mov,.wmv,.flv,.webm,.mkv"
            maxSize={50}
          />
        </div>
      </Modal>

      {/* File List Modal */}
      <Modal
        title={`รายการไฟล์ - ${currentFileListRecord?.title_name || ""}`}
        open={fileListModalVisible}
        onCancel={() => {
          setFileListModalVisible(false);
          setCurrentFileListRecord(null);
          setFileListData({ pdfs: [], photos: [], videos: [] });
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setFileListModalVisible(false);
              setCurrentFileListRecord(null);
              setFileListData({ pdfs: [], photos: [], videos: [] });
            }}
          >
            ปิด
          </Button>,
        ]}
        width={800}
      >
        <div style={{ padding: "20px 0" }}>
          {loadingFiles ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Text>กำลังโหลดรายการไฟล์...</Text>
            </div>
          ) : (
            <div>
              {/* PDFs Section */}
              {fileListData.pdfs.length > 0 && (
                <div style={{ marginBottom: "24px" }}>
                  <Title level={5} style={{ color: "#1890ff" }}>
                    <FileTextOutlined /> ไฟล์ PDF ({fileListData.pdfs.length})
                  </Title>
                  <div
                    style={{
                      background: "#f5f5f5",
                      padding: "12px",
                      borderRadius: "6px",
                    }}
                  >
                    {fileListData.pdfs.map((pdf) => (
                      <div
                        key={pdf.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px 0",
                          borderBottom: "1px solid #e8e8e8",
                        }}
                      >
                        <Space>
                          <FileTextOutlined style={{ color: "#1890ff" }} />
                          <Button
                            type="link"
                            style={{ padding: 0 }}
                            onClick={() =>
                              window.open(
                                `https://banpho.sosmartsolution.com/storage${pdf.post_pdf_file}`,
                                "_blank"
                              )
                            }
                          >
                            {pdf.post_pdf_file.split("/").pop()}
                          </Button>
                        </Space>
                        <Popconfirm
                          title="คุณแน่ใจหรือไม่ที่จะลบไฟล์นี้?"
                          onConfirm={() => handleDeleteFile(pdf.id, "pdf")}
                          okText="ใช่"
                          cancelText="ไม่"
                        >
                          <Button size="small" danger icon={<DeleteOutlined />}>
                            ลบ
                          </Button>
                        </Popconfirm>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Photos Section */}
              {fileListData.photos.length > 0 && (
                <div style={{ marginBottom: "24px" }}>
                  <Title level={5} style={{ color: "#52c41a" }}>
                    <EyeOutlined /> ไฟล์รูปภาพ ({fileListData.photos.length})
                  </Title>
                  <div
                    style={{
                      background: "#f6ffed",
                      padding: "12px",
                      borderRadius: "6px",
                    }}
                  >
                    {fileListData.photos.map((photo) => (
                      <div
                        key={photo.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px 0",
                          borderBottom: "1px solid #e8e8e8",
                        }}
                      >
                        <Space>
                          <EyeOutlined style={{ color: "#52c41a" }} />
                          <Button
                            type="link"
                            style={{ padding: 0 }}
                            onClick={() =>
                              window.open(
                                `https://banpho.sosmartsolution.com/storage${photo.post_photo_file}`,
                                "_blank"
                              )
                            }
                          >
                            {photo.post_photo_file.split("/").pop()}
                          </Button>
                          <Tag
                            color={
                              photo.post_photo_status === "1" ? "green" : "red"
                            }
                            size="small"
                          >
                            {photo.post_photo_status === "1"
                              ? "เปิดใช้งาน"
                              : "ปิดใช้งาน"}
                          </Tag>
                        </Space>
                        <Popconfirm
                          title="คุณแน่ใจหรือไม่ที่จะลบไฟล์นี้?"
                          onConfirm={() => handleDeleteFile(photo.id, "photo")}
                          okText="ใช่"
                          cancelText="ไม่"
                        >
                          <Button size="small" danger icon={<DeleteOutlined />}>
                            ลบ
                          </Button>
                        </Popconfirm>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos Section */}
              {fileListData.videos.length > 0 && (
                <div style={{ marginBottom: "24px" }}>
                  <Title level={5} style={{ color: "#722ed1" }}>
                    <UploadOutlined /> ไฟล์วิดีโอ ({fileListData.videos.length})
                  </Title>
                  <div
                    style={{
                      background: "#f9f0ff",
                      padding: "12px",
                      borderRadius: "6px",
                    }}
                  >
                    {fileListData.videos.map((video) => (
                      <div
                        key={video.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px 0",
                          borderBottom: "1px solid #e8e8e8",
                        }}
                      >
                        <Space>
                          <UploadOutlined style={{ color: "#722ed1" }} />
                          <Button
                            type="link"
                            style={{ padding: 0 }}
                            onClick={() =>
                              window.open(
                                `https://banpho.sosmartsolution.com/storage${video.post_video_file}`,
                                "_blank"
                              )
                            }
                          >
                            {video.post_video_file.split("/").pop()}
                          </Button>
                        </Space>
                        <Popconfirm
                          title="คุณแน่ใจหรือไม่ที่จะลบไฟล์นี้?"
                          onConfirm={() => handleDeleteFile(video.id, "video")}
                          okText="ใช่"
                          cancelText="ไม่"
                        >
                          <Button size="small" danger icon={<DeleteOutlined />}>
                            ลบ
                          </Button>
                        </Popconfirm>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Files Message */}
              {fileListData.pdfs.length === 0 &&
                fileListData.photos.length === 0 &&
                fileListData.videos.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#999",
                    }}
                  >
                    <Text>ไม่มีไฟล์แนบ</Text>
                  </div>
                )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
