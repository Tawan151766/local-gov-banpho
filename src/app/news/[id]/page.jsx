"use client";
import React, { useState, useEffect, use } from "react";
import NewsDetail from "../../component/News/NewsDetail";

export default function NewsPage({ params }) {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Unwrap the params Promise
  const resolvedParams = use(params);

  useEffect(() => {
    if (resolvedParams.id) {
      fetchNews(resolvedParams.id);
    }
  }, [resolvedParams.id]);

  const fetchNews = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/posts/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setNews(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch news');
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <NewsDetail 
        news={news} 
        loading={loading} 
        error={error} 
        onRetry={() => fetchNews(resolvedParams.id)}
      />
    </div>
  );
}