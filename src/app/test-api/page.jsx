"use client";
import { useState } from 'react';

export default function TestAPIPage() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const testAPI = async (endpoint, label) => {
    setLoading(prev => ({ ...prev, [label]: true }));
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      setResults(prev => ({ 
        ...prev, 
        [label]: { 
          status: response.status, 
          success: response.ok,
          data: data 
        } 
      }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [label]: { 
          status: 'ERROR', 
          success: false,
          error: error.message 
        } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [label]: false }));
    }
  };

  const tests = [
    {
      label: 'News (postTypeId=1)',
      endpoint: '/api/post-details?page=1&limit=4&postTypeId=1&withMedia=true'
    },
    {
      label: 'Activities (postTypeId=2)', 
      endpoint: '/api/post-details?page=1&limit=4&postTypeId=2&withMedia=true'
    },
    {
      label: 'Finance (postTypeId=3)',
      endpoint: '/api/post-details?page=1&limit=4&postTypeId=3&withMedia=true'
    },
    {
      label: 'Post Types',
      endpoint: '/api/post-types'
    },
    {
      label: 'All Posts',
      endpoint: '/api/post-details?page=1&limit=10&withMedia=true'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">API Testing Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {tests.map((test) => (
            <div key={test.label} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">{test.label}</h3>
              <button
                onClick={() => testAPI(test.endpoint, test.label)}
                disabled={loading[test.label]}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading[test.label] ? 'Testing...' : 'Test API'}
              </button>
              
              {results[test.label] && (
                <div className="mt-4">
                  <div className={`text-sm font-medium ${
                    results[test.label].success ? 'text-green-600' : 'text-red-600'
                  }`}>
                    Status: {results[test.label].status} 
                    {results[test.label].success ? ' ✅' : ' ❌'}
                  </div>
                  
                  <div className="mt-2 max-h-40 overflow-y-auto bg-gray-50 p-2 rounded text-xs">
                    <pre>{JSON.stringify(results[test.label], null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Test All APIs</h2>
          <button
            onClick={() => {
              tests.forEach(test => testAPI(test.endpoint, test.label));
            }}
            className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700"
          >
            Run All Tests
          </button>
        </div>

        {Object.keys(results).length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(results).map(([label, result]) => (
                <div key={label} className={`p-3 rounded ${
                  result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="font-medium">{label}</div>
                  <div className="text-sm text-gray-600">
                    {result.success ? 
                      `✅ Success - ${result.data?.data?.length || 0} items` : 
                      `❌ Failed - ${result.error || 'Unknown error'}`
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}