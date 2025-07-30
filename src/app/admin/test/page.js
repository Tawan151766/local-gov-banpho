'use client';
import { useState } from 'react';

export default function TestPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testDatabase = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-db');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const createSampleData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-db', {
        method: 'POST'
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testProcurementAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/post-details?page=1&limit=4&postTypeId=3&withMedia=true');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testAllPostTypes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/post-types');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testAllPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/post-details?page=1&limit=10&withMedia=true');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">API Test Page</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Database Tests</h2>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={testDatabase}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Database Connection'}
            </button>
            
            <button
              onClick={createSampleData}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Sample Data'}
            </button>
            
            <button
              onClick={testProcurementAPI}
              disabled={loading}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Procurement API'}
            </button>
            
            <button
              onClick={testAllPostTypes}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Post Types'}
            </button>
            
            <button
              onClick={testAllPosts}
              disabled={loading}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test All Posts'}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              Result: {result.success ? '✅ Success' : '❌ Error'}
            </h3>
            
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">API Endpoints</h3>
          <ul className="space-y-2 text-sm">
            <li><strong>GET</strong> /api/test-db - Test database connection</li>
            <li><strong>POST</strong> /api/test-db - Create sample data</li>
            <li><strong>GET</strong> /api/posts/procurement - Get procurement posts</li>
            <li><strong>GET</strong> /api/posts/procurement/types - Get procurement types</li>
            <li><strong>GET</strong> /api/posts - Get all posts with pagination</li>
          </ul>
        </div>
      </div>
    </div>
  );
}