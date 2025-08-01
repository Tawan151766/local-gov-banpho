"use client";
import { useState } from 'react';

export default function FixProductionPage() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const runAction = async (action, label) => {
    setLoading(prev => ({ ...prev, [label]: true }));
    try {
      const response = await fetch(action.endpoint, {
        method: action.method || 'GET',
        headers: action.headers || {}
      });
      const data = await response.json();
      setResults(prev => ({ 
        ...prev, 
        [label]: { 
          status: response.status, 
          success: response.ok,
          data: data,
          timestamp: new Date().toISOString()
        } 
      }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [label]: { 
          status: 'ERROR', 
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [label]: false }));
    }
  };

  const actions = [
    {
      label: '1. ตรวจสอบ Database Connection',
      description: 'ทดสอบการเชื่อมต่อฐานข้อมูลและตรวจสอบข้อมูลที่มีอยู่',
      endpoint: '/api/test-db',
      method: 'GET',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      label: '2. สร้าง Sample Data',
      description: 'สร้างข้อมูลตัวอย่างสำหรับทดสอบ (ข่าว, กิจกรรม, ประกาศ)',
      endpoint: '/api/seed-posts',
      method: 'POST',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      label: '3. ทดสอบ News API',
      description: 'ทดสอบ API สำหรับข่าวประชาสัมพันธ์ (postTypeId=1)',
      endpoint: '/api/post-details?page=1&limit=4&postTypeId=1&withMedia=true',
      method: 'GET',
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      label: '4. ทดสอบ Activities API',
      description: 'ทดสอบ API สำหรับกิจกรรม (postTypeId=2)',
      endpoint: '/api/post-details?page=1&limit=4&postTypeId=2&withMedia=true',
      method: 'GET',
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      label: '5. ทดสอบ Finance API',
      description: 'ทดสอบ API สำหรับประกาศจัดซื้อจัดจ้าง (postTypeId=3)',
      endpoint: '/api/post-details?page=1&limit=4&postTypeId=3&withMedia=true',
      method: 'GET',
      color: 'bg-indigo-600 hover:bg-indigo-700'
    },
    {
      label: '6. ตรวจสอบ Post Types',
      description: 'ดูรายการประเภทโพสต์ทั้งหมดในระบบ',
      endpoint: '/api/post-types',
      method: 'GET',
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  const runAllTests = () => {
    actions.forEach((action, index) => {
      setTimeout(() => {
        runAction(action, action.label);
      }, index * 1000); // เว้นระยะ 1 วินาทีระหว่างการทดสอบ
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🔧 แก้ไขปัญหา Production
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            เครื่องมือสำหรับแก้ไขปัญหาการโหลดข่าวประชาสัมพันธ์และกิจกรรมใน Production
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-w-4xl mx-auto">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-yellow-800 mb-2">🚨 ปัญหาที่พบ:</h3>
              <ul className="text-yellow-700 space-y-1 text-sm">
                <li>• เกิดข้อผิดพลาดในการโหลดข่าวประชาสัมพันธ์</li>
                <li>• เกิดข้อผิดพลาดในการโหลดข้อมูลกิจกรรม</li>
                <li>• API endpoints อาจไม่มีข้อมูลหรือเกิดข้อผิดพลาด</li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-green-800 mb-2">⚡ วิธีแก้ไขด่วน:</h3>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>• กดปุ่ม "แก้ไขด่วน" เพื่อสร้างข้อมูลตัวอย่าง</li>
                <li>• ระบบจะสร้าง post_types และ sample data</li>
                <li>• ข้อมูลจะแสดงในหน้าเว็บทันที</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <button
              onClick={runAllTests}
              className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg"
            >
              🚀 รันการทดสอบทั้งหมด
            </button>
            
            <button
              onClick={() => runAction({ endpoint: '/api/fix-production', method: 'POST' }, 'แก้ไขด่วน')}
              disabled={loading['แก้ไขด่วน']}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg disabled:bg-gray-400"
            >
              {loading['แก้ไขด่วน'] ? '⚡ กำลังแก้ไข...' : '⚡ แก้ไขด่วน (สร้างข้อมูล)'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {actions.map((action) => (
            <div key={action.label} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                {action.label}
              </h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {action.description}
              </p>
              
              <button
                onClick={() => runAction(action, action.label)}
                disabled={loading[action.label]}
                className={`w-full text-white py-2 px-4 rounded-lg transition-colors font-medium ${action.color} disabled:bg-gray-400`}
              >
                {loading[action.label] ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    กำลังทดสอบ...
                  </span>
                ) : (
                  'เริ่มทดสอบ'
                )}
              </button>
              
              {results[action.label] && (
                <div className="mt-4">
                  <div className={`text-sm font-medium flex items-center ${
                    results[action.label].success ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {results[action.label].success ? '✅' : '❌'}
                    <span className="ml-2">
                      Status: {results[action.label].status}
                    </span>
                  </div>
                  
                  <div className="mt-2 max-h-32 overflow-y-auto bg-gray-50 p-3 rounded text-xs border">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(results[action.label], null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {Object.keys(results).length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">📊 สรุปผลการทดสอบ</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {Object.entries(results).map(([label, result]) => (
                <div key={label} className={`p-4 rounded-lg border-2 ${
                  result.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="font-medium text-sm mb-2">{label}</div>
                  <div className="text-xs text-gray-600 mb-2">
                    {new Date(result.timestamp).toLocaleString('th-TH')}
                  </div>
                  <div className="text-sm">
                    {result.success ? (
                      <span className="text-green-700">
                        ✅ สำเร็จ - {result.data?.data?.length || result.data?.sampleData?.posts?.length || 0} รายการ
                      </span>
                    ) : (
                      <span className="text-red-700">
                        ❌ ล้มเหลว - {result.error || result.data?.error || 'ข้อผิดพลาดไม่ทราบสาเหตุ'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">💡 คำแนะนำการแก้ไข:</h3>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• หากการทดสอบ Database Connection ล้มเหลว → ตรวจสอบการตั้งค่าฐานข้อมูล</li>
                <li>• หากไม่มีข้อมูล → รันการสร้าง Sample Data</li>
                <li>• หาก API ทำงานแล้วแต่หน้าเว็บยังมีปัญหา → ตรวจสอบ Network หรือ CORS</li>
                <li>• หากยังมีปัญหา → ตรวจสอบ Console ในเบราว์เซอร์เพื่อดู Error Message</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}