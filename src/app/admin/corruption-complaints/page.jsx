"use client";
import { useState, useEffect } from 'react';
import { Search, Eye, Edit, Trash2, Filter, RefreshCw, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function AdminCorruptionComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusSummary, setStatusSummary] = useState({});
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const statusLabels = {
    pending: 'รอดำเนินการ',
    investigating: 'กำลังตรวจสอบ',
    completed: 'เสร็จสิ้น',
    rejected: 'ปฏิเสธ'
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    investigating: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const statusIcons = {
    pending: <Clock size={16} />,
    investigating: <AlertTriangle size={16} />,
    completed: <CheckCircle size={16} />,
    rejected: <XCircle size={16} />
  };

  useEffect(() => {
    fetchComplaints();
  }, [currentPage, statusFilter, searchTerm]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        status: statusFilter,
        search: searchTerm
      });

      const response = await fetch(`/api/corruption-complaints?${params}`);
      const result = await response.json();

      if (result.success) {
        setComplaints(result.data.complaints);
        setTotalPages(result.data.pagination.totalPages);
        setStatusSummary(result.data.statusSummary);
      } else {
        console.error('Error fetching complaints:', result.error);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchComplaints();
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const viewComplaint = async (id) => {
    try {
      const response = await fetch(`/api/corruption-complaints/${id}`);
      const result = await response.json();

      if (result.success) {
        setSelectedComplaint(result.data);
        setShowModal(true);
      } else {
        alert('เกิดข้อผิดพลาดในการดึงข้อมูล');
      }
    } catch (error) {
      console.error('Error fetching complaint details:', error);
      alert('เกิดข้อผิดพลาดในการดึงข้อมูล');
    }
  };

  const updateStatus = async (id, newStatus, note = '') => {
    try {
      const response = await fetch(`/api/corruption-complaints/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          statusNote: note,
          adminUser: 'admin' // In real app, get from session
        }),
      });

      const result = await response.json();

      if (result.success) {
        fetchComplaints();
        setShowModal(false);
        alert('อัปเดตสถานะเรียบร้อยแล้ว');
      } else {
        alert('เกิดข้อผิดพลาด: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดต');
    }
  };

  const deleteComplaint = async (id) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบคำร้องเรียนนี้?')) {
      return;
    }

    try {
      const response = await fetch(`/api/corruption-complaints/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        fetchComplaints();
        alert('ลบคำร้องเรียนเรียบร้อยแล้ว');
      } else {
        alert('เกิดข้อผิดพลาด: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting complaint:', error);
      alert('เกิดข้อผิดพลาดในการลบ');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                จัดการคำร้องเรียนการทุจริต
              </h1>
              <p className="text-gray-600">
                ระบบจัดการคำร้องเรียนการทุจริตและประพฤติมิชอบ
              </p>
            </div>
            <button
              onClick={fetchComplaints}
              className="mt-4 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <RefreshCw size={16} />
              รีเฟรช
            </button>
          </div>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(statusSummary).map(([status, count]) => (
            <div
              key={status}
              className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow ${
                statusFilter === status ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleStatusChange(status)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {statusLabels[status]}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
                <div className={`p-2 rounded-full ${statusColors[status]}`}>
                  {statusIcons[status]}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อผู้ร้องเรียน, ผู้ถูกร้องเรียน, หรือหน่วยงาน..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">ทุกสถานะ</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Filter size={16} />
                ค้นหา
              </button>
            </div>
          </form>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">กำลังโหลด...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              ไม่พบข้อมูลคำร้องเรียน
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        เลขที่อ้างอิง
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ผู้ร้องเรียน
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ผู้ถูกร้องเรียน
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        หน่วยงาน
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        สถานะ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        วันที่สร้าง
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        การจัดการ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {complaints.map((complaint) => (
                      <tr key={complaint.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {complaint.referenceNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {complaint.complainant_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {complaint.complainant_phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {complaint.accused_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {complaint.accused_position}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {complaint.accused_agency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[complaint.status]}`}>
                            {statusIcons[complaint.status]}
                            {statusLabels[complaint.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(complaint.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => viewComplaint(complaint.id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="ดูรายละเอียด"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => deleteComplaint(complaint.id)}
                              className="text-red-600 hover:text-red-900"
                              title="ลบ"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      ก่อนหน้า
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      ถัดไป
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        หน้า <span className="font-medium">{currentPage}</span> จาก{' '}
                        <span className="font-medium">{totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === currentPage
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal for viewing complaint details */}
      {showModal && selectedComplaint && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  รายละเอียดคำร้องเรียน {selectedComplaint.referenceNumber}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">ข้อมูลผู้ร้องเรียน</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      <p><strong>ชื่อ:</strong> {selectedComplaint.complainant_name}</p>
                      <p><strong>เบอร์โทร:</strong> {selectedComplaint.complainant_phone}</p>
                      <p><strong>อายุ:</strong> {selectedComplaint.complainant_age} ปี</p>
                      <p><strong>ที่อยู่:</strong> {selectedComplaint.complainant_address}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">ข้อมูลผู้ถูกร้องเรียน</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      <p><strong>ชื่อ:</strong> {selectedComplaint.accused_name}</p>
                      <p><strong>ตำแหน่ง:</strong> {selectedComplaint.accused_position}</p>
                      <p><strong>หน่วยงาน:</strong> {selectedComplaint.accused_agency}</p>
                      <p><strong>จังหวัด:</strong> {selectedComplaint.accused_province}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">รายละเอียดการร้องเรียน</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="whitespace-pre-wrap">{selectedComplaint.complaint_details}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">สถานะปัจจุบัน</h4>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedComplaint.status]}`}>
                      {statusIcons[selectedComplaint.status]}
                      {statusLabels[selectedComplaint.status]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-2">
                <select
                  onChange={(e) => {
                    if (e.target.value && e.target.value !== selectedComplaint.status) {
                      const note = prompt('กรุณาใส่หมายเหตุ (ถ้ามี):');
                      updateStatus(selectedComplaint.id, e.target.value, note || '');
                    }
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue=""
                >
                  <option value="">เปลี่ยนสถานะ...</option>
                  {Object.entries(statusLabels)
                    .filter(([status]) => status !== selectedComplaint.status)
                    .map(([status, label]) => (
                      <option key={status} value={status}>{label}</option>
                    ))}
                </select>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}